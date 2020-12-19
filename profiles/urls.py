from django.urls import path
from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^view_profile/(?P<profile_id>\d+)/$', views.view_profile, name='view_profile'),
    path('edit/', views.profile_details, name='edit_profile')
]
