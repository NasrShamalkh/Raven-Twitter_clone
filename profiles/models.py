from django.db import models
from django.contrib.auth.models import User 
from django.db.models.signals import post_save

# Create your models here.

# mapping table ===> each user can follow many profiles and each profile can follow many users (other profiles)

# this class is for capturing the time stamp whenever a relation happens between ther user ane profile
class ProfileConntections(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    profile_id = models.ForeignKey('Profile', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)


# main Profile model //// this profile class is only an addition to the user model ( the user model is our main model )
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE) # each user can have only one profile
    alias = models.CharField(max_length=100, blank=True, null=True)
    bio = models.CharField(max_length=2000, blank=True, null=True)
    date_of_birth = models.DateField(required=True)
    image_url = models.URLField(blank=True, null=True) # image url from cloudinary
    background_image_url = models.URLField(blank=True, null=True)
    date_joined = models.DateTimeField(auto_now_add=True) # timestamp whenever a profile is created
    # this the main functionality of followers
    # it creates a fiels in the User that is called following 
    # and of course a field here in the Profile (followers)
    followers = models.ManyToManyField(User, related_name='following', blank=True)
    # Profile.followers.all() =====> return all users that follow this profile
    #User.following.all() =====> all profiles this User follows


# this is just confirmation that the user is created for each profile
# make sure that our profiles get created everytime we do registration


def user_saved(sender, instance, created, *args, **kwarfs):
    if created:
        Profile.objects.get_or_create(user=instance)

post_save.connect(user_saved) # connecting the function to the signal