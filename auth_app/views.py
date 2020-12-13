from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RavenUserSerializer

# Create your views here.
class RavenUserCreate(APIView):
    # we set the permission to AllowAny because we want new users (unauthenticated) to be able to
    # to access this view and register
    permission_classes = (permissions.AllowAny,)
    
    def post(self, request, format='json'): # the format param is used to specify the output type of the response // default is None
        raven_user_serializer = RavenUserSerializer(data=request.data)
        # if the serializer is valid, create a new user and return it with 201 status code
        if raven_user_serializer.is_valid():
            user = raven_user_serializer.save()
            if user:
                json_data = raven_user_serializer.data
                return Response(json_data, status=status.HTTP_201_CREATED)
        return Response(raven_user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)