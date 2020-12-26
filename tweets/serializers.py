from rest_framework import serializers
from .models import Tweet, Reply


class TweetSerializer(serializers.ModelSerializer):
    # these fields are read_only because we cant provide them
    # we only want them on the API's response
    tweet_id = serializers.IntegerField(source='pk', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    alias = serializers.CharField(source='user.profile.alias', read_only=True)
    content = serializers.CharField(required=False, allow_blank=True)
    profile_image = serializers.URLField(source='user.profile.image_url', read_only=True)
    ##
    number_of_saves = serializers.SerializerMethodField('get_number_of_saves', read_only=True)
    number_of_likes = serializers.SerializerMethodField('get_number_of_likes', read_only=True)
    number_of_retweets = serializers.SerializerMethodField('get_number_of_retweets', read_only=True)
    number_of_replies = serializers.SerializerMethodField('get_number_of_replies', read_only=True)
    # retweeted_by_user = serializers.SerializerMethodField('check_retweeted_by_user', read_only=True)
    ##
    liked = serializers.SerializerMethodField('check_liked', read_only=True)
    retweeted = serializers.SerializerMethodField('check_retweeted', read_only=True)
    saved = serializers.SerializerMethodField('check_saved', read_only=True)
    timestamp = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Tweet
        fields = [
            'tweet_id',
            'user_id',
            'username',
            'user',
            'content',
            "alias",
            'media',
            'media_url',
            'public',
            'profile_image',
            'timestamp',
            'number_of_saves',
            'number_of_likes',
            'number_of_retweets',
            'number_of_replies',
            # 'retweeted_by_user',
            'liked',
            'retweeted',
            'saved',
        ]
        extra_kwargs = {
            'user': {'write_only': True},
            'retweeted_by_user': {'required' : False, 'read_only': True, 'default': False},
            'timestamp': {'read_only': True}
        }
        order_by = ('-timestamp') # not working


    def get_number_of_saves(self, obj):
        return len(obj.saves.all())

    def get_number_of_likes(self, obj):
        return len(obj.likes.all())

    def get_number_of_retweets(self, obj):
        return len(obj.retweets.all())

    def get_number_of_replies(self, obj):
        return len(obj.tweet_replies.all())

    def check_liked(self, obj):
        request = self.context.get('request', None)
        user = request.user
        if obj in user.liked_tweets.all():
            return True
        return False

    def check_retweeted(self, obj):
        request = self.context.get('request', None)
        user = request.user
        if obj in user.retweeted.all():
            return True
        return False

    def check_saved(self, obj):
        request = self.context.get('request', None)
        user = request.user
        if obj in user.saved_tweets.all():
            return True
        return False

    # def check_retweeted_by_user(self, obj):
    #     print()
            


class ReplySerializer(serializers.ModelSerializer):
    reply_id = serializers.IntegerField(source='pk', read_only=True)
    number_of_likes = serializers.SerializerMethodField('get_number_of_likes', read_only=True)
    liked = serializers.SerializerMethodField('check_liked', read_only=True)

    class Meta:
        model = Reply
        fields = (
            'reply_id',
            'tweet', # forign key # need to be added to data
            'user', # forign key # need to be added to data
            'content',
            'media',
            'media_url',
            'number_of_likes',
            'liked',
            'timestamp',
        )
        extra_kwargs = {
            'media': {'required': False},
            'content': {'required': False},
            'media_url': {'required': False},
            'timestamp': {'read_only': True},
        }

    def get_number_of_likes(self, obj):
        return len(obj.likes.all())

    def check_liked(self, obj):
        request = self.context.get('request', None)
        user = request.user
        if user in obj.likes.all():
            return True
        return False