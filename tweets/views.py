from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from rest_framework.response import Response
from .models import Tweet, Reply
from .serializers import TweetSerializer
from itertools import chain # compine multiple querysets
from functools import reduce

# create a tweet or get Home tweets
@api_view(['POST', 'GET'])
def tweets_list(request):
    if(request.method == 'GET'):
        user = request.user
        tweets_querysets = [] # an empty list to add all of the queyrsets to
        for following_profile in user.following.all(): # adding all of the tweets from the profiles who the current user follows to tweets_qeuryset 
            tweets_querysets.append(Tweet.objects.filter(user_id=following_profile.user.id))

        def reduce_func(current_value, accumulator): # reduce arguement function
            #chain method combines multiple querysets into one 
            # by using reduce we are able to combine all of the querysets in the tweets_queryset list
            return chain(current_value, accumulator)

            # resutl of the reduce function on the tweets_qeurysets
        chain_result = reduce(reduce_func, tweets_querysets)

        tweet_serializer = TweetSerializer(chain_result, many=True)
        return Response(tweet_serializer.data, status=status.HTTP_200_OK)

    if(request.method == 'POST'):
        user = request.user
        post_data = JSONParser().parse(request)
        post_data['user'] = user.pk # adding the current user as the owner of the tweet (pk)
        tweet_serializer = TweetSerializer(data=post_data) # writable data
        if tweet_serializer.is_valid():
            tweet_serializer.save()
            return JsonResponse(tweet_serializer.data, safe=False, status=status.HTTP_201_CREATED)
        return JsonResponse(tweet_serializer.errors, safe=False, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_tweets(request): # returns the tweets of the current user
    user = request.user
    tweets = user.tweets.all()
    tweet_serializer = TweetSerializer(tweets, many=True)
    return Response(tweet_serializer.data, status=status.HTTP_200_OK)
