from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework import status
from django.http.response import JsonResponse
from rest_framework.response import Response
from .models import Profile
from .serializers import ProfileSerializer


@api_view(['GET'])
def view_profile(request, profile_id):
    try:
        profile = Profile.objects.get(pk=profile_id)
        profile_serializer = ProfileSerializer(profile)
        return JsonResponse(profile_serializer.data, status=status.HTTP_202_ACCEPTED)
    except Profile.DoesNotExist:
        # send this if the user is not found
        return JsonResponse({'message': 'DoesNotExist'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['PUT'])
def profile_details(request):
    put_data = JSONParser().parse(request)
    profile_id = put_data.pop('profile_id')
    profile = Profile.objects.get(pk=profile_id)
    # any data passed into the serializer is updated
    # anything else is ignored
    # we are using the same serializer but we are only interacting with the writable data (not read_only) but returning all data after update
    profile_serializer = ProfileSerializer(profile, data=put_data)
    if profile_serializer.is_valid():
        profile_serializer.save()
        return JsonResponse(profile_serializer.data, status=status.HTTP_202_ACCEPTED)
    return JsonResponse(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# this view accepts a put request and acts as a trigger, if the current user follows the given id, then it unfollows it and vise versa
@api_view(['PUT'])
def follow_status(request, profile_id):
    # check if the profie exists, else return 404 not found
    try:
        user = request.user
        profile = Profile.objects.get(pk=profile_id)
    except Profile.DoesNotExist:
        return Response({"message": 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

    if profile in user.following.all(): # unfollow (if the profile in the users following list, the we unfollow)
        try:
            # this is a many_to_many realtionship 
            # we dont have to update both sides on adding or removing, they get updated automatically
            user.following.remove(profile)
            return Response({"message": f"Profile with id {profile_id} removed from following"}, status=status.HTTP_202_ACCEPTED)
        except:
            return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

    # follow
    try:
        # when a proifle is added to the following list, it also gets added to the followers list on the target profile
        user.following.add(profile)
        return Response({"message": f"Profile with id {profile_id} added to following"}, status=status.HTTP_202_ACCEPTED)
    except:
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)