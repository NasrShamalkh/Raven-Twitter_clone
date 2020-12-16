from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RavenUserSerializer

# Create your views here.
class RavenUserCreate(APIView):
    # we set the permission to AllowAny because we want new users (unauthenticated) to be able to
    # to access this view and register
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def post(self, request, format='json'): # the format param is used to specify the output type of the response // default is None
        raven_user_serializer = RavenUserSerializer(data=request.data)
        # if the serializer is valid, create a new user and return it with 201 status code
        if raven_user_serializer.is_valid():
            user = raven_user_serializer.save()
            if user:
                json_data = raven_user_serializer.data
                return Response(json_data, status=status.HTTP_201_CREATED)
        return Response(raven_user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutAndBlacklistRefreshTokenForUserView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        