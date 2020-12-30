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
from profiles.models import Profile

# create a tweet or get Home tweets
@api_view(['POST', 'GET'])
def tweets_list(request):
    if(request.method == 'GET'):
        user = request.user
        tweets_querysets = []  # an empty list to add all of the queyrsets to
        serialized_retweets_list = []
        # adding all of the tweets from the profiles who the current user follows to tweets_qeuryset
        for following_profile in user.following.all():
            tweets_querysets.append(Tweet.objects.filter(
                user_id=following_profile.user.id))

            #adding retweets //\\ for each tweet we have to serializer it an add it to the list
            # retweets = following_profile.user.retweeted.all()
            # print(retweets, 'retweets, --------, for each profile')
            # serialized_tweets_for_profile = TweetSerializer(retweets, many=True, context={'request': request, 'check_user': following_profile.user.id})
            # serialized_retweets_list.append(serialized_tweets_for_profile.data)

        def reduce_func(current_value, accumulator):  # reduce arguement function
            # chain method combines multiple querysets into one
            # by using reduce we are able to combine all of the querysets in the tweets_queryset list
            return chain(current_value, accumulator)

            # resutl of the reduce function on the tweets_qeurysets
        if not tweets_querysets and not user.tweets.all(): # check if empty ==> return 404 # following tweets + own tweets
            return Response([], status=status.HTTP_404_NOT_FOUND)
        else: 
            tweets_querysets.append(user.tweets.all()) # adding user tweets
            # tweets_querysets.append(user.retweeted.all()) # adding user retweets
            chain_result = reduce(reduce_func, tweets_querysets) # user.tweets.all() is the initializer of the reduce func

        tweet_serializer = TweetSerializer(chain_result, context={'request': request}, many=True)
        # result = chain(serialized_retweets_list, tweet_serializer.data)
        return Response(tweet_serializer.data, status=status.HTTP_200_OK)

    if(request.method == 'POST'):
        user = request.user
        post_data = JSONParser().parse(request)
        # refuse empty tweets # allow for media-only tweets or content-only tweets (or both !)
        if ('content' not in post_data or post_data['content'] == '') and ('media' not in post_data or post_data['media'] == False):
            return Response({'message': 'You cant post an empty tweet !'}, status=status.HTTP_400_BAD_REQUEST)

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
    # show the tweets if they are public or if they are private and belong to the current user or pirvate and follw
    tweets = []
    for tweet in all_tweets:
        if tweet.public == True or tweet.user == user or user in profile_user.profile.followers.all(): # if not public check for current user or follow status
            tweets.append(tweet)
    
    tweet_serializer = TweetSerializer(tweets, context={'request': request}, many=True)
    return Response(tweet_serializer.data, status=status.HTTP_200_OK)


# add and remove tweets from saved list for each user based on the tweet id
@api_view(['PUT'])
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
@api_view(['PUT'])
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

# get liked tweets and replies of a user
@api_view(['GET'])
def get_liked(request, user_id):
    user = RavenUser.objects.get(pk=user_id)
    liked_tweets = user.liked_tweets.all()
    liked_replies = user.liked_replies.all()
    dicts_list = []
    for tweet in liked_tweets:
        tweet_serializer = TweetSerializer(tweet, context={'request': request})
        dicts_list.append(tweet_serializer.data)

    for reply in liked_replies:
        reply_tweet = reply.tweet
        dicts_list.append({
            'tweet': TweetSerializer(reply_tweet, context={'request': request}).data,
            'reply': ReplySerializer(reply, context={'request': request}).data
        })

    return Response(dicts_list, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_tweet_like_list(request, tweet_id):
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


# this view is to handle edit and delete of tweets
@api_view(['DELETE', 'PUT'])
def manage_tweet(request, tweet_id):
    user = request.user
    try:
        tweet = Tweet.objects.get(pk=tweet_id)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # prevent access for anybody but the owner of the tweet
    if user.id != tweet.user_id:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    # Edit a tweet 
    if request.method == 'PUT':
        put_data = JSONParser().parse(request)
        put_data['user'] = user.id
        tweet_serializer = TweetSerializer(tweet, data=put_data, context={'request': request})
        if tweet_serializer.is_valid():
            tweet_serializer.save()
            return Response(tweet_serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(tweet_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        # furthere confimration (because deleting is sensitive)
        if tweet not in user.tweets.all():
            return Response({'message': f'Tweet with id {tweet_id} not found in user tweets list'} ,status=status.HTTP_404_NOT_FOUND)
        try:
            tweet.delete()
            return Response({'message': f'Tweet with id {tweet_id} for user {user.username} is deleted successfully !'}, status=status.HTTP_202_ACCEPTED)
        except:
            return Response(status=status.HTTP_501_NOT_IMPLEMENTED)


# Retweets ---//---

@api_view(['POST', 'GET'])
def retweet_list(request, tweet_id):
    user = request.user
    try: 
        tweet = Tweet.objects.get(pk=tweet_id)
    except:
        return Response({"message": 'Tweet not found'}, status=status.HTTP_404_NOT_FOUND)
    
    #  retweet functionality
    if request.method == 'POST':
        if tweet not in user.retweeted.all(): # means we can add it
            try:
                tweet.retweets.add(user)
                return Response({'message': f'Tweet with id {tweet_id} retweeted for user  {user.username}'}, status=status.HTTP_202_ACCEPTED)
                raise NotImplementedError
            except NotImplementedError:
                return Response(status=status.HTTP_501_NOT_IMPLEMENTED)
        return Response({'message': "Already retweeted"}, status=status.HTTP_409_CONFLICT)
    
    #get all retweeters for a tweet  
    if request.method == 'GET':
        retweet_users = tweet.retweets.all() # users who retweetd
        # we need profiles
        retweet_profiles = []
        for user in retweet_users:
            retweet_profiles.append(user.profile)
        
        profile_brief_serializer = ProfileBriefSerializer(retweet_profiles, context={'request': request}, many=True)
        return Response(profile_brief_serializer.data, status=status.HTTP_200_OK)


# add a reply to a tweet or get all replies
@api_view(['GET', 'POST'])
def replies_list(request, tweet_id):
    # we will not go throught public or private because if the user can see the tweet that means he/she is a follower
    user = request.user
    try:
        tweet = Tweet.objects.get(pk=tweet_id)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    # get replies
    if request.method == 'GET':
        replies = tweet.tweet_replies.all()
        reply_serializer = ReplySerializer(replies, context={'request': request}, many=True)
        return Response(reply_serializer.data, status=status.HTTP_200_OK)

    # add a new reply
    if request.method == 'POST':
        post_data = JSONParser().parse(request)
        # dealing with empty replies
        if ('content' not in post_data or post_data['content'] == '') and ('media' not in post_data or post_data['media'] == False):
            return Response({'message': 'You cant post an empty Reply !'}, status=status.HTTP_400_BAD_REQUEST)
        
        post_data['user'] = user.id
        post_data['tweet'] = tweet.id
        reply_serializer = ReplySerializer(data=post_data, context={'request': request})
        if reply_serializer.is_valid():
            reply_serializer.save()
            return Response(reply_serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(reply_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

@api_view(['DELETE'])
def delete_reply(request, reply_id):
    user = request.user
    try:
        reply = Reply.objects.get(pk=reply_id)
    except:
        return Response({'message': 'Reply not found !'} ,status=status.HTTP_404_NOT_FOUND)
    # check owner or reply
    if user.id != reply.user_id:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    if reply not in user.user_replies.all():
        return Response({'message': f'Reply with id {reply_id} not found in user replies list'} ,status=status.HTTP_404_NOT_FOUND)
    try:
        reply.delete()
        return Response({'message': f'Reply with id {reply_id} for user {user.username} is deleted successfully !'}, status=status.HTTP_202_ACCEPTED)
    except:
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

@api_view(['PUT']) # trigger functionlity for liking and unliking a reply
def liked_replies_list(request, reply_id):
    user = request.user
    # add a reply to the liked list of user (ManyToMany, gets added on both sides)
    try:
        reply = Reply.objects.get(pk=reply_id)
    except:
        return Response({'message': 'Reply not found !'} ,status=status.HTTP_404_NOT_FOUND)
    
    if user not in reply.likes.all():
        try:
            reply.likes.add(user)
            return Response({'message': f'Reply with id {reply_id} added to liked replies'}, status=status.HTTP_202_ACCEPTED)
            raise NotImplementedError 
        except NotImplementedError:
            return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

    # remove a reply from liked list
    else: 
        try:
            reply.likes.remove(user)
            return Response({'message': f'Reply with id {reply_id} removed from liked replies'}, status=status.HTTP_202_ACCEPTED)
            raise NotImplementedError
        except NotImplementedError:
            return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

@api_view(['GET'])
def get_reply_like_list(request, reply_id):
    reply = Reply.objects.get(pk=reply_id)
    liked_users = reply.likes.all()
    # we need the profiles not the RavenUsers
    liked_users_profiles = []
    for user in liked_users:
        liked_users_profiles.append(user.profile)
    
    profile_brief_serialzier = ProfileBriefSerializer(liked_users_profiles, context= {
        'request': request
    }, many=True)

    return Response(profile_brief_serialzier.data, status=status.HTTP_200_OK)

# get user replies (send reply and tweet) used in view tweets & replies
@api_view(['GET'])
def get_user_tweets_and_replies(request, user_id):
    user = RavenUser.objects.get(pk=user_id)
    dicts_list = []
    for reply in user.user_replies.all():
        tweet = reply.tweet
        reply_serializer = ReplySerializer(reply, context={'request': request})
        tweet_serializer = TweetSerializer(tweet, context={'request': request})
        dicts_list.append({
            'tweet': tweet_serializer.data,
            'reply': reply_serializer.data
        })
    tweets_serializer = TweetSerializer(user.tweets.all(), many=True, context={'request': request})
    for tweet in tweets_serializer.data: 
        dicts_list.append(tweet)
    return Response(dicts_list, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_user_media(request, user_id):
    # search in user tweets and replies if any tweet/replies contains media and reaturn it
    user = RavenUser.objects.get(pk=user_id)
    media_tweets = user.tweets.filter(media=True)
    dicts_list = []
    for media_tweet in media_tweets:
        dicts_list.append(TweetSerializer(media_tweet, context={'request': request}).data)

    for reply in user.user_replies.all():
        if reply.media == True:
            tweet = reply.tweet
            reply_serializer = ReplySerializer(reply, context={'request': request})
            tweet_serializer = TweetSerializer(tweet, context={'request': request})
            dicts_list.append({
                'tweet': tweet_serializer.data,
                'reply': reply_serializer.data
            })

    return Response(dicts_list, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_tweet(request, tweet_id):
    try:
        tweet = Tweet.objects.get(pk=tweet_id)
        tweet_serializer = TweetSerializer(tweet, context={'request': request})
        return Response(tweet_serializer.data, status=status.HTTP_200_OK)
    except:
        return Response({'message': "Tweet not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_top(request):
        user = request.user
        # Getting all users who are not the current user & there profile is not in the following list of the current user
        users = RavenUser.objects.exclude(profile__in=user.following.all()).exclude(pk=user.id)
        tweets_querysets = []
        for n_user in users:
            # adding the tweets of the users where they're not public
            tweets_querysets.append(Tweet.objects.filter(
                user_id=n_user.id).exclude(public=False))

        def reduce_func(current_value, accumulator): 
            return chain(current_value, accumulator)

        if not tweets_querysets and not user.tweets.all():
            return Response([], status=status.HTTP_404_NOT_FOUND)
        else: 
            chain_result = reduce(reduce_func, tweets_querysets) # chaining everything through reduced chain

        tweet_serializer = TweetSerializer(sorted(list(chain_result), key = lambda i: -((len(i.likes.all())) + (len(i.retweets.all())) + (len(i.tweet_replies.all())) + (len(i.saves.all()))))[:20], context={'request': request}, many=True)
        """
        sorted(list(chain_result)[:20], key = lambda i: -((len(i.likes.all())) + (len(i.retweets.all()) + (len(i.saves.all())))))
        this sorts the list with a limit of 20 tweets and applies the lamda as sorting function
        in which we combine the likes, retweets and saves all together to detrmain the popularity of the tweet ( sum of all ainteractions (execpt replies))
        CCCoooooooooLLLL
        https://media.makeameme.org/created/cool-man-real.jpg
        """
        return Response(tweet_serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_explore_media(request):
        user = request.user
        # Getting all users who are not the current user & there profile is not in the following list of the current user
        users = RavenUser.objects.exclude(profile__in=user.following.all()).exclude(pk=user.id)
        tweets_querysets = []
        for n_user in users:
            # adding the tweets of the users where they're not public
            tweets_querysets.append(Tweet.objects.filter(
                user_id=n_user.id).exclude(public=False).exclude(media=False))

        def reduce_func(current_value, accumulator): 
            return chain(current_value, accumulator)

        if not tweets_querysets and not user.tweets.all():
            return Response([], status=status.HTTP_404_NOT_FOUND)
        else: 
            chain_result = reduce(reduce_func, tweets_querysets) # chaining everything through reduced chain
        tweet_serializer = TweetSerializer(sorted(list(chain_result), key = lambda i: -((len(i.likes.all())) + (len(i.retweets.all()) + (len(i.saves.all())))))[:20], context={'request': request}, many=True)
        return Response(tweet_serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_latest(request):
        user = request.user
        # Getting all users who are not the current user & there profile is not in the following list of the current user
        users = RavenUser.objects.exclude(profile__in=user.following.all()).exclude(pk=user.id)
        tweets_querysets = []
        for n_user in users:
            # adding the tweets of the users where they're not public
            tweets_querysets.append(Tweet.objects.filter(
                user_id=n_user.id).exclude(public=False))

        def reduce_func(current_value, accumulator): 
            return chain(current_value, accumulator)

        if not tweets_querysets and not user.tweets.all():
            return Response([], status=status.HTTP_404_NOT_FOUND)
        else: 
            chain_result = reduce(reduce_func, tweets_querysets) # chaining everything through reduced chain
            data = sorted(list(chain_result), key = lambda i: i.timestamp)
            data.reverse()
        tweet_serializer = TweetSerializer(data, context={'request': request}, many=True)
        return Response(tweet_serializer.data, status=status.HTTP_200_OK)
