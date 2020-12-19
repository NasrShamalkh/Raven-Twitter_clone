from django.urls import path
from . import views


urlpatterns = [
    path('tweets_list/', views.tweets_list)
]