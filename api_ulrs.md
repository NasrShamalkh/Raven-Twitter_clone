- admin (admin/)

- auth_app (auth/)
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
                        "image_url": image_url, (optional)
                        "background_image_url": background_image_url, (optional)
                    }
                }

    POST --> api/auth/user/logout/ # name="blacklist"
                body {
                    "refresh_token": refresh_token
                }
    POST --> api/auth/user/logout_all/ #name="logout_all" # logout from all devices
                headers {
                    Authorization: "JWT " + access_token 
                }
    PUT --> api/auth/user/edit/   # name='edit_user'  /// note /// only send the things you want to update
                body {
                    "username": username,
                    "email": email,
                    "mode": mode,
                    "update_password": Boolean,
                    "current_password": current_password,
                    "new_password": new_password,
                }
                
    DELETE --> api/auth/user/delete/ # name='delete_user'
                headers {
                    Authorization: "JWT " + access_token 
                }
                body {
                    "refresh_token": refresh_token
                }

- profiles (api/profiles/)
    GET --> api/profiles/view_profile/:id # name='view_profile'
    PUT --> api/prfiles/edit/             # name='edit_profile'
            body {
                "profile_id": id,
                "alias": new_alias,
                ... bio, image_url, background_image_url
            }
    PUT --> api/profiles/follow_status/:id  # name='change_follow_status'  (trigger functionality)
    GET --> api/profiles/get_followers/:id  # name='get_followers'
    GET --> api/profiles/get_following/:id  # name='get_following'


- tweets (api/tweets/)
