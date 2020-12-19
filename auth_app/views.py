from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework.parsers import JSONParser
#### 
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
####
from rest_framework.decorators import api_view
from .models import RavenUser

from .serializers import RavenUserSerializer, EditUserSerializer

@api_view(['DELETE', 'PUT'])
def currentUser(request):
# this view handles delte user and alson blacklists the user's refresh tokens to log them out as well 
    if request.method == 'DELETE': # delets current User
        try:
            user_serializer = RavenUserSerializer(request.user)
            # getting the user from the db
            raven_user = RavenUser.objects.get(email=user_serializer.data['email'])
            if raven_user:
                refresh_token = request.data['refresh_token']
                token = RefreshToken(refresh_token)
                token.blacklist()
                raven_user.delete()
                return Response({"message": "user deleted"}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"message": "user not found"},status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT': # updates (Edit) the currentUser data
        put_data = JSONParser().parse(request)
        user = request.user
        if 'update_password' in put_data and put_data['update_password'] == True: # if this evaluates to true then we need to update the password
            current_password = put_data['current_password']
            new_password = put_data['new_password']
            if user.check_password(current_password):
                user.set_password(new_password)
                # if the user only wants to update the password save and return message
                if not 'email' in put_data and not 'username' in put_data and not 'mode' in put_data:
                    user.save()
                    return Response({'message': 'Password updated !'}, status=status.HTTP_202_ACCEPTED)
            else:
                return Response({"message": "Wrong password !"}, status=status.HTTP_401_UNAUTHORIZED)
        # if user choses to update other fields
        edit_user_serializer = EditUserSerializer(user, data=put_data)
        if edit_user_serializer.is_valid():
            edit_user_serializer.save()
            user.save()
            return Response({'message': 'Updated Successfully !'}, status=status.HTTP_202_ACCEPTED)
        return Response(edit_user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)



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
                ## handling login after user creation
                # refresh_token = TokenObtainPairSerializer().get_token(user)  
                # access_token = AccessToken().for_user(user)
                # return Response({"refresh" : str(refresh_token),"access" : str(access_token)} )
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

   