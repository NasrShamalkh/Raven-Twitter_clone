from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken, OutstandingToken, BlacklistedToken
from rest_framework.parsers import JSONParser
#### 
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
####
from rest_framework.decorators import api_view
from .models import RavenUser

from .serializers import RavenUserSerializer, EditUserSerializer, CurrentUserSerializer

@api_view(['DELETE', 'PUT', 'GET'])
def currentUser(request):
# this view handles delte user and also blacklists the user's refresh tokens to log them out as well  + get current_user
    if request.method == 'GET': 
        user = request.user
        current_user_serializer = CurrentUserSerializer(user)
        return Response(current_user_serializer.data, status=status.HTTP_202_ACCEPTED)


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
            return Response(edit_user_serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(edit_user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# Create your views here.
class RavenUserCreate(APIView):
    # we set the permission to AllowAny because we want new users (unauthenticated) to be able to
    # to access this view and register
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def post(self, request, format='json'): # the format param is used to specify the output type of the response // default is None
        post_data = request.data
        # checking if the username or email is duplicate
        if RavenUser.objects.filter(username=post_data['username']).exists():
            return Response({"message": 'Username already Exists'}, status=status.HTTP_409_CONFLICT)
        if RavenUser.objects.filter(email=post_data['email']).exists():
            return Response({"message": 'Email already Exists'}, status=status.HTTP_409_CONFLICT) 
        
        # checking if the passwords match
        password2 = post_data.pop('password2')
        if password2 != post_data['password']:
            return Response({"message": 'Passwords did not match'}, status=status.HTTP_400_BAD_REQUEST)
             
        raven_user_serializer = RavenUserSerializer(data=request.data)
        # if the serializer is valid, create a new user and return it with 201 status code
        if raven_user_serializer.is_valid():
            user = raven_user_serializer.save()
            if user:
                json_data = raven_user_serializer.data
                return Response(json_data, status=status.HTTP_201_CREATED)
        return Response(raven_user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

####   -----     ------     ATTENTION     ------    ---------      ##### 

# https://miro.medium.com/max/511/1*Qp_2RBl4GgCn022OZFpkfQ.jpeg

#### -------                 +++                    ---------      ######

class LogoutAndBlacklistRefreshTokenForUserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

# to black list all of the user's tokens in the outstanding tokens list, thus loging out from all devices
class LogoutAll(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        tokens = OutstandingToken.objects.filter(user__id=request.user.id)
        for token in tokens:
            t, _ = BlacklistedToken.objects.get_or_create(token=token)
        
        return Response(status=status.HTTP_205_RESET_CONTENT)