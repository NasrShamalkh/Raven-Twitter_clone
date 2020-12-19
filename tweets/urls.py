from django.urls import path
from . import views


urlpatterns = [
    path('tweets_list/', views.tweets_list, name='tweets_list'),
    path('get_tweets/', views.get_tweets, name='get_tweets'), # current user's tweets
]