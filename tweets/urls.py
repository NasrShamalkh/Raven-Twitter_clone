from django.urls import path
from django.conf.urls import url
from . import views


urlpatterns = [
    path('tweets_list/', views.tweets_list, name='tweets_list'),
    url(r'^get_tweets/(?P<user_id>\d+)/$', views.get_tweets, name='get_tweets'),
    url(r'^saved_tweets_list/(?P<tweet_id>\d+)/$', views.saved_tweets_list, name='saved_tweets_list'), # trigger
    path('get_saved_tweets/', views.get_saved_tweets, name='get_saved_tweets'),
    url(r'^liked_tweets_list/(?P<tweet_id>\d+)/$', views.liked_tweets_list, name='liked_tweets_list'), # trigger
    path('get_liked_tweets/', views.get_liked_tweets, name='get_liked_tweets'),
    url(r'^get_like_list/(?P<tweet_id>\d+)/$', views.get_like_list, name='get_like_list'),
    url(r'^replies/replies_list/(?P<tweet_id>\d+)/$', views.replies_list, name='replies_list'), # GET | POST
    url(r'^replies/delete/(?P<reply_id>\d+)/$', views.delete_reply, name='delete_reply'),
]