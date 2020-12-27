from .models import Profile
from rest_framework import serializers
from auth_app.models import RavenUser

"""
This serializer handles two things:
1 - when creating a new user (by altering the create method a new profile gets created with every user) and this serializer handles 
serializing (validating in this case) some of the data
2 - when a user opens a profile to view this serializer handles the API response and the data is sent through this serializer
3 - profile update (Edit)
"""
class ProfileSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='pk', read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True) # now we have the user_id available in the front
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    alias = serializers.CharField(allow_blank=True, required=False)
    ##
    # using SerializerMethodField to calculate the count / length
    number_of_followers = serializers.SerializerMethodField('get_number_of_followers', read_only=True)
    number_of_following = serializers.SerializerMethodField('get_number_of_following', read_only=True)
    following = serializers.SerializerMethodField('check_following', read_only=True)
    ##
    bio = serializers.CharField(allow_blank=True, required=False)
    date_of_birth = serializers.DateField(required=True)
    image_url = serializers.URLField(allow_blank=True, required=False)
    background_image_url = serializers.URLField(allow_blank=True, required=False)
    date_joined = serializers.DateTimeField(read_only=True)
    number_of_likes = serializers.SerializerMethodField('get_number_of_likes', read_only=True)
    number_of_tweets = serializers.SerializerMethodField('get_number_of_tweets', read_only=True)
    number_of_tweets_and_replies = serializers.SerializerMethodField('get_number_of_tweets_and_replies', read_only=True)
    number_of_media = serializers.SerializerMethodField('get_number_of_media', read_only=True)

    class Meta:
        model = Profile
        fields = (
                'username',
                'id',
                'user_id',
                'email',
                'alias',
                'bio',
                'number_of_likes',
                'number_of_tweets',
                'number_of_tweets_and_replies',
                'number_of_media',
                'date_of_birth',
                'image_url',
                'background_image_url',
                'date_joined',
                'following',
                'number_of_followers',
                'number_of_following',
                )

    def get_number_of_followers(self, obj):
        return len(obj.followers.all())
        
    def get_number_of_following(self, obj):
        return len(obj.user.following.all())

    def get_number_of_likes(self, obj):
        return len(obj.user.liked_tweets.all()) + len(obj.user.liked_replies.all())

    def get_number_of_tweets(self, obj):
        return len(obj.user.tweets.all())

    def get_number_of_tweets_and_replies(self, obj):
        return len(obj.user.tweets.all()) + len(obj.user.user_replies.all())

    def get_number_of_media(self, obj):
        return len(obj.user.tweets.filter(media=True))
    
    def check_following(self, obj):
        request = self.context.get('request', None)
        user = request.user
        if user in obj.followers.all():
            return True
        return False



# this serializer handles serializing data sent as a brief or a preview of a profile ( in searches or displaying followers)
# a miniture version of the upper serializer to avoid complexity
# only for serializing api responses (read_only)
class ProfileBriefSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='pk', read_only=True)
    related = serializers.SerializerMethodField('get_related', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    number_of_followers = serializers.SerializerMethodField('get_number_of_followers', read_only=True)

    class Meta:
        model = Profile
        fields = ('id', 'username', 'number_of_followers', 'image_url', 'related', )

    def get_number_of_followers(self, obj):
        return len(obj.followers.all())
 

        
    # this method returns:
    # other users that you follow (who follow this profile)/// this profile is also followed by 
    def get_related(self, obj):
        # getting the current user (request user)
        request = self.context.get('request', None) # self.context ==> the context that the serializer is executing in
        user = request.user
        following_profile = user.following.all() # Profile objects (users follow profiles but profiles follow users not other profiles)
        followers_user = obj.followers.all() # RavenUser # target profile followers list
        related_followers = []
        for follow_user in followers_user: # iterating users (that follow the target profile)
            if follow_user.profile in following_profile: # if one of the profiles that the follow the target profile is in the current user's followers list
                related_followers.append({               # then add it to the recomendations list (related)
                    "id": follow_user.profile.id,
                    "username": follow_user.username,
                    })
        return related_followers