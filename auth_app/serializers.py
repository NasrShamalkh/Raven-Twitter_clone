from rest_framework import serializers
from .models import RavenUser
from profiles.serializers import ProfileSerializer
from profiles.models import Profile
from rest_framework_simplejwt.tokens import RefreshToken


class RavenUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required = True)
    username = serializers.CharField()
    password = serializers.CharField(min_length=8, max_length=30, write_only=True)
    profile = ProfileSerializer(required=True)
    tokens = serializers.SerializerMethodField()

    class Meta:
        model = RavenUser
        fields = ('email', 'username', 'password', 'profile', 'tokens', )
        extra_kwargs = {'password': {'wirte_only': True}} # we need our password to be write_only

    """
    in the create method:
    // we poped out the password from validated_data ==> hashed it ==> saved the instance ==> return it
    """
    # login on register #
    def get_tokens(self, user):
        tokens = RefreshToken.for_user(user)
        refresh = str(tokens)
        access = str(tokens.access_token)
        data = {
            "refresh": refresh,
            "access": access
        }
        return data

    def create(self, validated_data): # overriding built-in create method
        password = validated_data.pop('password', None)
        instance = self.Meta.model(
            username=validated_data['username'],
            email=validated_data['email']
        ) # as long as the fields are the same we can just use this
        if password is not None:
            instance.set_password(password) # this "set_password" is the method that does the hashing 
        instance.save()
        
        # creating profile
        profile_data = validated_data.pop('profile', None)
        if profile_data:
            profile = Profile.objects.get_or_create(user=instance, **profile_data)[0]
            validated_data['profile'] = profile
        return instance

# special serializer for editing username and email to avoid complixity
class EditUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    mode = serializers.CharField(required=False)
    class Meta:
        model = RavenUser
        fields = ('username', 'email', 'mode',)

# for viewing current user only
class CurrentUserSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(read_only=True, source='pk')
    profile_id = serializers.IntegerField(read_only=True, source='profile.pk')
    username = serializers.CharField(read_only=True)
    alias = serializers.CharField(read_only=True, source='profile.alias')
    email = serializers.EmailField(read_only=True)
    image_url = serializers.URLField(read_only=True, source='profile.image_url')
    mode = serializers.CharField(read_only=True)

    class Meta:
        model = RavenUser
        fields = ('user_id', 'profile_id', 'image_url', 'username', 'alias', 'email', 'mode', )

