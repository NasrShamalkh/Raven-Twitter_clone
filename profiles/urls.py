from django.urls import path
from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^view_profile/(?P<user_id>\d+)/$', views.view_profile, name='view_profile'),
    url(r'^follow_status/(?P<profile_id>\d+)/$', views.follow_status, name='change_follow_status'),
    url(r'^get_followers/(?P<profile_id>\d+)/$', views.get_followers, name='get_followers'),
    url(r'^get_following/(?P<profile_id>\d+)/$', views.get_following, name='get_following'),
    path('edit/', views.profile_details, name='edit_profile'),
    path('most_popular/', views.most_popular, name='most_popular'),
    path('who_to_follow/', views.who_to_follow, name='who_to_follow'),
    path('search/', views.search, name='search'),
]