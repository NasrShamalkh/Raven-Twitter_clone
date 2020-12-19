from rest_framework import serializers
from .models import Tweet

class TweetSerializer(serializers.ModelSerializer):
    # these fields are read_only because we cant provide them 
    # we only want them on the API's response
    tweet_id = serializers.IntegerField(source='pk', read_only=True)
    user_id = serializers.IntegerField(source='user.pk', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)



    class Meta:
        model = Tweet
        fields=[
            'tweet_id',
            'user_id',
            'username',
            'user',
            'content',
            'media',
            'media_url',
            'public_reply',
        ]
        