from django.urls import path
from django.conf.urls import url
from . import views


urlpatterns = [
    path('tweets_list/', views.tweets_list, name='tweets_list'),
    url(r'^manage_tweet/(?P<tweet_id>\d+)/$', views.manage_tweet, name='manage_tweet'),
    url(r'^get_tweets/(?P<user_id>\d+)/$', views.get_tweets, name='get_tweets'),
    url(r'^saved_tweets_list/(?P<tweet_id>\d+)/$', views.saved_tweets_list, name='saved_tweets_list'), # trigger
    path('get_saved_tweets/', views.get_saved_tweets, name='get_saved_tweets'),
    url(r'^liked_tweets_list/(?P<tweet_id>\d+)/$', views.liked_tweets_list, name='liked_tweets_list'), # trigger
    url(r'^get_tweet_like_list/(?P<tweet_id>\d+)/$', views.get_tweet_like_list, name='get_tweet_like_list'),
    url(r'^replies/replies_list/(?P<tweet_id>\d+)/$', views.replies_list, name='replies_list'), # GET | POST
    url(r'^replies/delete/(?P<reply_id>\d+)/$', views.delete_reply, name='delete_reply'),
    url(r'^replies/liked_replies_list/(?P<reply_id>\d+)/$', views.liked_replies_list, name='liked_replies_list'), # trigger
    url(r'^replies/get_reply_like_list/(?P<reply_id>\d+)/$', views.get_reply_like_list, name='get_reply_like_list'),
    path('get_liked_tweets/', views.get_liked_tweets, name='get_liked_tweets'), # must be get likes (tweets and replies)
]