from django.urls import path
# official docs for simple jwt on how to obtain and refresh tokens
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('obtain_token/', TokenObtainPairView.as_view(), name='token_obtain'),
    path('refresh_token/', TokenRefreshView.as_view(), name='token_refresh'),
]
