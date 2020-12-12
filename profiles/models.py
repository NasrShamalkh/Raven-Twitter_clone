from django.db import models
from django.contrib.auth.models import User 
from django.db.models.signals import post_save

# Create your models here.

#link followers / following to each other with a timestamp
# each user has followers and each follower ( user ) also has followers
# Many to many relationship 
class ProfileConntections(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    profile_id = models.ForeignKey('Profile', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)


# main Profile model //// this profile class is only an addition to the user model ( the user model is our main model )
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE) # each user can have only one profile
    alias = models.CharField(max_length=100, blank=True, null=True)
    bio = models.CharField(max_length=2000, blank=True, null=True)
    date_of_birth = models.DateField()
    image_url = models.URLField(blank=True, null=True) # image url from cloudinary
    background_image_url = models.URLField(blank=True, null=True)
    date_joined = models.DateTimeField(auto_now_add=True) # timestamp whenever a profile is created
    # this the main functionality of followers
    # it creates a fiels in the User that is called following 
    # and of course a field here in the Profile (followers)
    followers = models.ManyToManyField(User, related_name='following', blank=True, through=ProfileConntections)
    # Profile.followers.all() =====> return all users that follow this profile
    #User.following.all() =====> all profiles this User follows


# make sure that our profiles get created everytime we do registration a new uesr
def user_saved(sender, instance, created, *args, **kwarfs):
    if created:
        Profile.objects.get_or_create(user=instance)

post_save.connect(user_saved) # connecting the function to the signal