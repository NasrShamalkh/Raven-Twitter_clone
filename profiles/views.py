from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework import status
from django.http.response import JsonResponse
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
