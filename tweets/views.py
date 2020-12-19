from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from .models import Tweet, Reply
from .serializers import TweetSerializer

# Create your views here.
@api_view(['POST', 'GET'])
def tweets_list(request):
    if(request.method == 'GET'):
        tweets_list = Tweet.objects.all()
        tweets_serializer = TweetSerializer(tweets_list, many=True)
        return JsonResponse(tweets_serializer.data, safe=False, status=status.HTTP_200_OK)

    if(request.method == 'POST'):
        user = request.user
        print(user)
        post_data = JSONParser().parse(request)
        ## added the user to the post_data to deal with forign key (quick fix)
        post_data['user'] = user.pk
        tweet_serializer = TweetSerializer(data=post_data)
        if tweet_serializer.is_valid():
            tweet_serializer.save()
            return JsonResponse(tweet_serializer.data, safe=False, status=status.HTTP_201_CREATED)
        return JsonResponse(tweet_serializer.errors, safe=False, status=status.HTTP_400_BAD_REQUEST)
