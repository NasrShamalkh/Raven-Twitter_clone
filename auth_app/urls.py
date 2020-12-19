from django.urls import path
from . import views 
# official docs for simple jwt on how to obtain and refresh tokens
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('obtain_token/', TokenObtainPairView.as_view(), name='token_obtain'),
    path('refresh_token/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/register/', views.RavenUserCreate.as_view(), name='user_register'),
    path('user/logout/', views.LogoutAndBlacklistRefreshTokenForUserView.as_view(), name='blacklist'),
    path('user/edit/', views.currentUser, name='edit_user'),
    path('user/delete/', views.currentUser, name='delete_user'), 
]
