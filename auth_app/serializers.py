from rest_framework import serializers
from .models import RavenUser

class RavenUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required = True)
    username = serializers.CharField()
    password = serializers.CharField(min_length=8, max_length=30, write_only=True)

    class Meta:
        model = RavenUser
        fields = ('email', 'username', 'password')
        extra_kwargs = {'password': {'wirte_only': True}} # we need our password to be write_only

    """
    in the create method:
    // we poped out the password from validated_data ==> hashed it ==> saved the instance ==> return it
    """
    def create(self, validated_data): # overriding built-in create method
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data) # as long as the fields are the same we can just use this
        if password is not None:
            instance.set_password(password) # this "set_password" is the method that does the hashing 
        instance.save()
        return instance

