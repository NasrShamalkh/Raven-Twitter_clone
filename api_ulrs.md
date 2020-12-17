- admin (admin/)

- auth_app (auth/)
    GET --> api/auth/currentUser/ # name="currentUser"
                headers {
                    Authorization: "JWT " + access_token 
                }

    POST --> api/auth/obtain_token/ # name="token_obtain"
                body {
                    "username": username,
                    "password": password
                }

    POST --> api/auth/refresh_token/ # name="token_refresh"  
            body {
                    "refresh": refresh_token
                }
            

    -POST -> api/auth/user/register/ # name="user_register"
                body {
                    "username": username,
                    "email": email,
                    "password": password,
                    "profile": {
                        "date_of_birth": date_of_birth,
                        "alias": alias, (optional)
                        "bio": bio, (optional)
                        "image_url: image_url, (optional)
                        "background_image_url: background_image_url, (optional)
                    }
                }

    POST --> api/auth/user/logout/ # name="blacklist"
                body {
                    "refresh_token": refresh_token
                }
                
    DELETE --> api/auth/user/delete/ # name='delete_user'
                headers {
                    Authorization: "JWT " + access_token 
                }
                body {
                    "refresh_token": refresh_token
                }

- profiles (api/profiles/)
    PUT --> api/profiles/update/ # name='update_profile'  

- tweets (api/tweets/)
