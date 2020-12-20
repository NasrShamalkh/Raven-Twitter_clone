from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from rest_framework.response import Response
from .models import Tweet, Reply
from auth_app.models import RavenUser
from .serializers import TweetSerializer, ReplySerializer
from itertools import chain  # compine multiple querysets
from functools import reduce
from profiles.serializers import ProfileBriefSerializer # to view liked users

# create a tweet or get Home tweets
@api_view(['POST', 'GET'])
def tweets_list(request):
    if(request.method == 'GET'):
        user = request.user
        tweets_querysets = []  # an empty list to add all of the queyrsets to
        # adding all of the tweets from the profiles who the current user follows to tweets_qeuryset
        for following_profile in user.following.all():
            tweets_querysets.append(Tweet.objects.filter(
                user_id=following_profile.user.id))

        def reduce_func(current_value, accumulator):  # reduce arguement function
            # chain method combines multiple querysets into one
            # by using reduce we are able to combine all of the querysets in the tweets_queryset list
            return chain(current_value, accumulator)

            # resutl of the reduce function on the tweets_qeurysets
        chain_result = reduce(reduce_func, tweets_querysets)

        tweet_serializer = TweetSerializer(chain_result, context={'request': request}, many=True)
        return Response(tweet_serializer.data, status=status.HTTP_200_OK)

    if(request.method == 'POST'):
        user = request.user
        post_data = JSONParser().parse(request)
        # adding the current user as the owner of the tweet (pk)
        post_data['user'] = user.pk
        tweet_serializer = TweetSerializer(data=post_data, context={'request': request})  # writable data
        if tweet_serializer.is_valid():
            tweet_serializer.save()
            return JsonResponse(tweet_serializer.data, safe=False, status=status.HTTP_201_CREATED)
        return JsonResponse(tweet_serializer.errors, safe=False, status=status.HTTP_400_BAD_REQUEST)
    

# returns tweets of a selected profile + public / private sorting
@api_view(['GET'])
def get_tweets(request, user_id): 
    user = request.user 
    profile_user = RavenUser.objects.get(pk=user_id) # target_profile_user
    all_tweets = profile_user.tweets.all()
    # show the tweets if they are public or if they are private and belong to the current user
    tweets = []
    for tweet in all_tweets:
        if tweet.public == True or tweet.user == user: # if not public check for current user
            tweets.append(tweet)
    
    tweet_serializer = TweetSerializer(tweets, context={'request': request}, many=True)
    return Response(tweet_serializer.data, status=status.HTTP_200_OK)


# add and remove tweets from saved list for each user based on the tweet id
@api_view(['PUT', 'DELETE'])
def saved_tweets_list(request, tweet_id):
    user = request.user
    # if the tweet is not found return 404
    try:
        tweet = Tweet.objects.get(pk=tweet_id)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # add a tweet to saved list
    if user not in tweet.saves.all(): # if the user is not in the saves list of the tweet then we can saved 
        try:
            tweet.saves.add(user)
            return Response({'message': f'tweet with id {tweet_id} added to saved tweets'}, status=status.HTTP_202_ACCEPTED)
            raise NotImplementedError # if the 'if' statement fails raise a NotImplementedError and return 501, because it is already saved
        except NotImplementedError:
            return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

    # remove a tweet from saved list
    else: 
        try:
            tweet.saves.remove(user)
            return Response({'message': f'tweet with id {tweet_id} removed from saved tweets'}, status=status.HTTP_202_ACCEPTED)
            raise NotImplementedError
        except NotImplementedError:
            return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

# get saved tweets of the current user
@api_view(['GET'])
def get_saved_tweets(request):
    user = request.user
    saved_tweets = user.saved_tweets.all()
    tweets_serializer = TweetSerializer(saved_tweets, context={'request': request}, many=True)
    return Response(tweets_serializer.data, status=status.HTTP_200_OK)


# add and remove tweets from liked list for each user based on the tweet_id
@api_view(['PUT', 'DELETE'])
def liked_tweets_list(request, tweet_id):
    user = request.user
    # if the tweet is not found return 404
    try:
        tweet = Tweet.objects.get(pk=tweet_id)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # add a tweet to liked list
    if user not in tweet.likes.all(): # if the user is not in the likes list of the tweet then we can like it 
        try:
            tweet.likes.add(user)
            return Response({'message': f'tweet with id {tweet_id} added to liked tweets'}, status=status.HTTP_202_ACCEPTED)
            raise NotImplementedError # if the 'if' statement fails raise a NotImplementedError and return 501, because it is already liked
        except NotImplementedError:
            return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

    # remove a tweet from liked list
    else: 
        try:
            tweet.likes.remove(user)
            return Response({'message': f'tweet with id {tweet_id} removed from liked tweets'}, status=status.HTTP_202_ACCEPTED)
            raise NotImplementedError
        except NotImplementedError:
            return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

# get liked tweets of the current user
@api_view(['GET'])
def get_liked_tweets(request):
    user = request.user
    liked_tweets = user.liked_tweets.all()
    tweets_serializer = TweetSerializer(liked_tweets, context={'request': request}, many=True)
    return Response(tweets_serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_like_list(request, tweet_id):
    tweet = Tweet.objects.get(pk=tweet_id)
    liked_users = tweet.likes.all()
    # we need the profiles not the RavenUsers
    liked_users_profiles = []
    for user in liked_users:
        liked_users_profiles.append(user.profile)
    
    profile_brief_serialzier = ProfileBriefSerializer(liked_users_profiles, context= {
        'request': request
    }, many=True)

    return Response(profile_brief_serialzier.data, status=status.HTTP_200_OK)


# add a reply to a tweet or get all replies
@api_view(['GET', 'POST'])
def replies_list(request, tweet_id):
    user = request.user
    try:
        tweet = Tweet.objects.get(pk=tweet_id)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    # get replies
    if request.method == 'GET':
        replies = Tweet.tweet_replies.all()
        reply_serializer = ReplySerializer(replies, many=True)
        return Response(reply_serializer.data, status=status.HTTP_200_OK)

    # add a new reply
    if request.method == 'POST':
        # if public = true, check if follower
        pass
        

@api_view(['DELETE'])
def delete_reply(request, reply_id):
    pass
