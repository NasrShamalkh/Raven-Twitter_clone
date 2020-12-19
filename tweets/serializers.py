from rest_framework import serializers
from .models import Tweet


class TweetSerializer(serializers.ModelSerializer):
    # these fields are read_only because we cant provide them
    # we only want them on the API's response
    tweet_id = serializers.IntegerField(source='pk', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    content = serializers.CharField(required=True)
    profile_image = serializers.URLField(source='user.profile.image_url', read_only=True)
    timestamp = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Tweet
        fields = [
            'tweet_id',
            'user_id',
            'username',
            'user',
            'content',
            'media',
            'media_url',
            'public_reply',
            'profile_image',
            'timestamp',
        ]
        extra_kwargs = {
            'user': {'write_only': True},
            'timestamp': {'read_only': True}
        }
        order_by = ('-timestamp') # not working

