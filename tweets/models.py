from django.db import models
from auth_app.models import RavenUser

# Create your models here.

# here liking and retweeting are the same regarding the db relationships // of course there functionality is different 
# each user can have many liked tweets and each tweet can have many users who like it
class TweetLike_relation(models.Model):
    user = models.ForeignKey(RavenUser, on_delete=models.CASCADE)
    tweet = models.ForeignKey('Tweet', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

#the same goes for retweets 
# each user can have many retweeted tweets and each tweet can have many users who retweeted it 
class TweetRetweet_relation(models.Model):
    user = models.ForeignKey(RavenUser, on_delete=models.CASCADE)
    tweet = models.ForeignKey('Tweet', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

# link replies and likes
class ReplyLike_relation(models.Model):
    user = models.ForeignKey(RavenUser, on_delete=models.CASCADE)
    reply = models.ForeignKey('Reply', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

#link tweets and saved
class TweetSave_relation(models.Model):
    user = models.ForeignKey(RavenUser, on_delete=models.CASCADE)
    tweet = models.ForeignKey('Tweet', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

class Tweet(models.Model):
    # this is where we connect users to ther tweets 
    user = models.ForeignKey(RavenUser, related_name='tweets', on_delete=models.CASCADE) # each user can have multiple tweets
    content = models.TextField(blank=True, null=True) 
    media = models.BooleanField(default=False)
    media_url = models.URLField(blank=True, null=True)
    public = models.BooleanField(default=True) # everyone / only-followers can view / reply
    ###-------------------------------###
    likes = models.ManyToManyField(RavenUser, related_name='liked_tweets', through=TweetLike_relation)
    retweets = models.ManyToManyField(RavenUser, related_name='retweeted', through=TweetRetweet_relation)
    saves = models.ManyToManyField(RavenUser, related_name='saved_tweets', through=TweetSave_relation)
    ###-------------------------------###
    timestamp = models.DateTimeField(auto_now_add=True)


class Reply(models.Model):
    tweet = models.ForeignKey('Tweet', related_name='tweet_replies', on_delete=models.CASCADE) # a tweet can have multiple reples
    user = models.ForeignKey(RavenUser, related_name='user_replies', on_delete=models.CASCADE) # each user can have multiple replies
    content = models.CharField(max_length=280, blank=True, null=True) # max length of a tweet / reply is 280 characters
    media = models.BooleanField(default=False)
    media_url = models.URLField(blank=True, null=True)
    likes = models.ManyToManyField(RavenUser, related_name='liked_replies', through=ReplyLike_relation)
    timestamp = models.DateTimeField(auto_now_add=True)

