from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework import status
from django.http.response import JsonResponse
from rest_framework.response import Response
from .models import Profile
from .serializers import ProfileSerializer, ProfileBriefSerializer
from auth_app.models import RavenUser
from django.shortcuts import redirect


@api_view(['GET'])
def view_profile(request, user_id):
    try:
        profile_user = RavenUser.objects.get(pk=user_id)
        profile = Profile.objects.get(pk=profile_user.profile.id)
        profile_serializer = ProfileSerializer(profile, context={'request': request})
        return JsonResponse(profile_serializer.data, status=status.HTTP_202_ACCEPTED)
    except Profile.DoesNotExist:
        # send this if the user is not found
        return JsonResponse({'message': 'DoesNotExist'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['PUT'])
def profile_details(request):
    user = request.user
    profile = user.profile
    # adding the date_of_birth because it is required and making it read_only will miss up registration
    date_of_birth = profile.date_of_birth
    put_data = JSONParser().parse(request)
    put_data['date_of_birth'] = date_of_birth
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

    if profile in user.following.all():  # unfollow (if the profile in the users following list, then we unfollow)
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


@api_view(['GET'])
def get_followers(request, profile_id):
    profile = Profile.objects.get(pk=profile_id)
    followers_users = profile.followers.all()
    # we extract the profiles from users and add them to an iterable (list) because we need to add the profiles not the users
    """
    there is probably a more straight forward way of doing this, but it iiiiisssss whaattt ittt isssss :)
    """

    profile_list = []
    for user in followers_users:
        # adding the profiles to the profile_list
        profile_list.append(user.profile)

    # we pass in the context because we want to interact with the user in the serializer class (request.user)
    profile_brief_serializer = ProfileBriefSerializer(profile_list, context={'request': request}, many=True)
    return Response(profile_brief_serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_following(request, profile_id):
    profile = Profile.objects.get(pk=profile_id)
    following_list = profile.user.following.all()
    # profile_list = []
    # for user in following_users:
    #     profile_list.append(user.profile)

    profile_brief_serializer = ProfileBriefSerializer(following_list, context={'request': request}, many=True)
    return Response(profile_brief_serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def most_popular(request):
    user = request.user
    # execluding following and current user
    users = RavenUser.objects.exclude(profile__in=user.following.all()).exclude(pk=user.id)
    profiles = []
    for user in users:
        profiles.append(user.profile)

    # getting the most popular profiles based on the number of followers
    # this is where the real magic happens
    #we sort a list with a limit of 10
    # passing in a lambda function as owr sorting function becase then applying our sorting method (the len() propert) on the lambda argument which is our elements

    brief_serializer = ProfileBriefSerializer(sorted(list(profiles), key = lambda i: -len(i.followers.all()))[:10], many=True, context={'request': request})
    return Response(brief_serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def who_to_follow(request):
    pass
#     user = request.user
#     users = RavenUser.objects.exclude(profile__in=user.following.all()).exclude(pk=user.id)
#     followers_user = user.profile.followers.all()
#     profiles = []
#     for user in users:
#         profiles.append(user.profile)
    
#     mommy = RavenUser.objects.get(username='marry').profile
#     bobby_profile = RavenUser.objects.get(username='bobby').profile
#     marry_profile = mommy.profile
#     # print(mommy.followers.exclude(profile__in=user.following.all()))
#     print(marry_profile.followers.all())
#     # now we have all profiles that the user does not follow
#     brief_serializer = ProfileBriefSerializer(sorted(list(profiles), key = lambda i: -(len(i.followers.filter(profile__in=user.following.all()))))[:10], many=True, context={'request': request})
#     return Response(brief_serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def search(request):
    try:
        post_data = JSONParser().parse(request)  
        search_input = post_data['search_input']
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    results = []

    if search_input[0] == '@':
        users = RavenUser.objects.filter(username__icontains=search_input[1:])
        for user in users:
            results.append(user.profile)
    else:
        profiles = Profile.objects.filter(alias__icontains=search_input)
        print(profiles)
        results = profiles

    profile_brief = ProfileBriefSerializer(results, many=True, context={'request': request})
    return Response(profile_brief.data, status=status.HTTP_200_OK)