from .models import Profile
from rest_framework import serializers

"""
This serializer handles two things:
1 - when creating a new user (by altering the create method a new profile gets created with every user) and this serializer handles 
serializing (validating in this case) some of the data
2 - when a user opens a profile to view this serializer handles the API response and the data is sent through this serializer
3 - profile update (Edit)
"""
class ProfileSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='pk', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    alias = serializers.CharField(allow_blank=True, required=False)
    ##
    # using SerializerMethodField to calculate the count / length
    number_of_followers = serializers.SerializerMethodField('get_number_of_followers', read_only=True)
    number_of_following = serializers.SerializerMethodField('get_number_of_following', read_only=True)
    ##
    bio = serializers.CharField(allow_blank=True, required=False)
    date_of_birth = serializers.DateField(required=False, read_only=True)
    image_url = serializers.URLField(allow_blank=True, required=False)
    background_image_url = serializers.URLField(allow_blank=True, required=False)
    date_joined = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Profile
        fields = ('username', 'id', 'email', 'alias', 'bio', 'date_of_birth', 'image_url', 'background_image_url', 'date_joined', 'number_of_followers', 'number_of_following', )

    def get_number_of_followers(self, obj):
        return len(obj.followers.all())
        
    def get_number_of_following(self, obj):
        return len(obj.user.following.all())
