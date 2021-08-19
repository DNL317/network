from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    followers = models.ManyToManyField(User, blank=True, related_name="followers")
    following = models.ManyToManyField(User, blank=True, related_name="following")

    def __str__(self):
        return f"User profile for {self.user}"

    def serialize(self):
        return {
            "followers": self.followers.count(),
            "following": self.following.count()
    }       

class Post(models.Model):
    poster = models.ForeignKey(User, on_delete=models.CASCADE, related_name="poster")
    body = models.TextField(max_length=250)
    timestamp = models.DateTimeField(auto_now_add=True, blank=True)
    likes = models.ManyToManyField(Profile, blank=True, related_name="likes")

    def __str__(self):
        return f"{self.poster} posted '{self.body}' at {self.timestamp}. It has {self.likes} likes"
    
    def serialize(self):
        return {
            "id": self.id,
            "body": self.body,
            "timestamp": self.timestamp.strftime("%b %#d %Y, %#I:%M %p"),
            "likes": self.likes.count(),
            "poster": self.poster.username
    }

    
