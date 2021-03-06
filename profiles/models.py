from django.db import models
from auth_app.models import RavenUser 
# from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.

#link followers / following to each other with a timestamp
# each user has followers and each follower ( user ) also has followers
# Many to many relationship 
class ProfileConntections(models.Model):
    user_id = models.ForeignKey(RavenUser, on_delete=models.CASCADE)
    profile_id = models.ForeignKey('Profile', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)


# main Profile model //// this profile class is only an addition to the user model ( the user model is our main model )
class Profile(models.Model):
    user = models.OneToOneField(RavenUser, on_delete=models.CASCADE) # each user can have only one profile
    alias = models.CharField(max_length=100, blank=True, null=True)
    bio = models.CharField(max_length=2000, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    image_url = models.URLField(blank=True, null=True) # image url from cloudinary
    background_image_url = models.URLField(blank=True, null=True)
    date_joined = models.DateTimeField(auto_now_add=True) # timestamp whenever a profile is created
    # this the main functionality of followers
    # it creates a fiels in the RavenUser that is called following 
    # and of course a field here in the Profile (followers)
    followers = models.ManyToManyField(RavenUser, related_name='following', blank=True, through=ProfileConntections)
    # Profile.followers.all() =====> return all users that follow this profile
    #RavenUser.following.all() =====> all profiles this RavenUser follows


