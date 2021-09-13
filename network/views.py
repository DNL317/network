from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.http.response import JsonResponse
import json
from django.shortcuts import render
from django.urls import reverse
from .models import User, Post, Profile


def index(request):

    print("index running in python")

    current_user = request.user.username
    print(f"current_user is {current_user}")


    # save new post submitted via post method
    if request.method == "POST":
        post = request.POST["post-body"]
        new_post = Post()
        new_post.poster = request.user
        new_post.body = post

        new_post.save()

    # update post with new content submitted via put method
    elif request.method == "PUT":
        data = json.loads(request.body)
        post_id = int(data["post_id"])
        new_body = data["new_body"]
        post = Post.objects.filter(id=post_id).first()
        post.body = new_body
        post.save()
        return JsonResponse({
            "result": True
        })

    # render index page with contect needed
    return render(request, "network/index.html", {
        'current_user': current_user
    })

def login_view(request):
    print("login_view running in python")
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")

def logout_view(request):
    print("logout_view running in python")
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    print("register running in python")
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)

        #auto-create a profile for new user
        new_profile = Profile()
        new_profile.user = user
        new_profile.save()
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

def all_posts(request):

    print("all_posts running in python")

    # retrieve all posts from database, order by time
    posts = Post.objects.all()
    posts = posts.order_by("-timestamp").all()

    return JsonResponse([post.serialize() for post in posts], safe=False)

def profile_posts(request, username_lookup):

    print("profile_posts running in python")

    # retrieve posts from database filtered by poster, order by time
    posts = Post.objects.all().filter(poster__username=username_lookup)
    posts = posts.order_by("-timestamp").all()
    print(f"{posts}")

    return JsonResponse([post.serialize() for post in posts], safe=False)

def following_posts(request):

    print("following_posts running in python")

    # retrieve posts from database filtered by those followed, order by timestamp
    following = Profile.objects.get(user=request.user).following.all()
    posts = Post.objects.filter(poster__in=following).order_by("-timestamp").all()

    return JsonResponse([post.serialize() for post in posts], safe=False)

def liked_posts(request):

    print("liked_posts running in python")

    # retrieve posts from database filtered by those liked, order by timestamp
    liked_posts = Profile.objects.get(user=request.user).liked_posts.order_by("-timestamp")
    return JsonResponse([post.serialize() for post in liked_posts], safe=False)

def follow_count(request, username_lookup):

    print(f"follow_count running in python")

    try:
        user = User.objects.get(username=username_lookup)
    except User.DoesNotExist:
        pass

    try:
        profiles = Profile.objects.get(user=user)
    except Profile.DoesNotExist:
        pass

    return JsonResponse([profiles.serialize()], safe=False)

def follow(request, username_lookup):

    print("follow runnning in python")

    followed_user = User.objects.get(username=username_lookup)
    print(f"followed_user is {followed_user.username}")

    followed_profile = Profile.objects.get(user=followed_user)

    following_user = request.user
    print("step 3 done")
    print(f"following_user is {following_user.username}")

    following_profile = Profile.objects.get(user=following_user)

    followed_profile.followers.add(following_user)
    following_profile.following.add(followed_user)

    current_user = request.user.username

    return render(request, "network/index.html", {
        'current_user': current_user
    })

def unfollow(request, username_lookup):

    print("unfollow runnning in python")

    unfollowed_user = User.objects.get(username=username_lookup)
    print(f"unfollowed_user is {unfollowed_user.username}")

    unfollowed_profile = Profile.objects.get(user=unfollowed_user)

    unfollowing_user = request.user
    print("step 3 done")
    print(f"unfollowing_user is {unfollowing_user.username}")

    unfollowing_profile = Profile.objects.get(user=unfollowing_user)

    unfollowed_profile.followers.remove(unfollowing_user)
    unfollowing_profile.following.remove(unfollowed_user)

    current_user = request.user.username

    return render(request, "network/index.html", {
        'current_user': current_user
    })

def follow_button(request):

    print("follow_button running in python")
    current_logged_user = request.user
    current_logged_profile = Profile.objects.get(user=current_logged_user)
    print(f"current_logged_profile is {current_logged_profile.user.username}")
    return JsonResponse([current_logged_profile.serialize()], safe=False)

def like(request, post_liked_id):

    print("like function running")
    post_liked = Post.objects.filter(id=post_liked_id).first()
    liking_user = request.user
    post_liked.likes.add(liking_user)

    liking_profile = Profile.objects.get(user=liking_user)
    liking_profile.liked_posts.add(post_liked)

    return JsonResponse(True, safe=False)

def unlike(request, post_unliked_id):

    print("unlike function running")
    post_unliked = Post.objects.filter(id=post_unliked_id).first()
    unliking_user = request.user
    post_unliked.likes.remove(unliking_user)

    liking_profile = Profile.objects.get(user=unliking_user)
    liking_profile.liked_posts.remove(post_unliked)

    return JsonResponse(True, safe=False)