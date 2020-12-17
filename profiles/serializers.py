from .models import Profile
from rest_framework import serializers

class ProfileSerializer(serializers.ModelSerializer):
    alias = serializers.CharField(allow_blank=True, required=False)
    bio = serializers.CharField(allow_blank=True, required=False)
    date_of_birth = serializers.DateField(required=False)
    image_url = serializers.URLField(allow_blank=True, required=False)
    background_image_url = serializers.URLField(allow_blank=True, required=False)

    class Meta:
        model = Profile
        fields = ('alias', 'bio', 'date_of_birth', 'image_url', 'background_image_url',)
