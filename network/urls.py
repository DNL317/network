
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("all_posts", views.all_posts, name="all_posts"),
    path("<str:username_lookup>/profile", views.follow_count, name="follow_count"),
    path("<str:username_lookup>/follow", views.follow, name="follow"),
    path("<str:username_lookup>/unfollow", views.unfollow, name="unfollow"),
    path("<str:username_lookup>/follow_button", views.follow_button, name="follow_button"),
    path("profile_info", views.follow_button, name="profile_info")
]
