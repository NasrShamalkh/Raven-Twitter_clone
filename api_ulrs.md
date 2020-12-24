- admin (admin/)

-----------------------------------------------------------------------------------  

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
            

    POST -> api/auth/user/register/ # name="user_register"  
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
    GET --> api/auth/user/current_user/  # name='current_user'  
                
    DELETE --> api/auth/user/delete/ # name='delete_user'  
                headers {  
                    Authorization: "JWT " + access_token   
                }  
                body {  
                    "refresh_token": refresh_token  
                }  
  
-------------------------------------------------------------------------------------  


- profiles (api/profiles/) ## Authorization required  
    GET --> api/profiles/view_profile/:id/ # name='view_profile'  
    PUT --> api/prfiles/edit/             # name='edit_profile'  
            body {  
                "profile_id": id,  
                "alias": new_alias,  
                ... bio, image_url, background_image_url  
            }  
    PUT --> api/profiles/follow_status/:id/  # name='change_follow_status'  (trigger functionality)  
    GET --> api/profiles/get_followers/:id/  # name='get_followers'  
    GET --> api/profiles/get_following/:id/  # name='get_following'  

-----------------------------------------------------------------------------------------  
- tweets (api/tweets/) ## Authorization required  
    POST --> api/tweets/tweets_list/   # name='tweets_list'  ## add a new tweet  
            body {  
                "content": content,  
                "media": media, (optional)  
                "media_url": media_url (optional)  
            }  
    GET  --> api/tweets/tweets_list/  # name='tweets_list' ## get all tweets of the 'following' profiles (Home tweets)  
    GET  --> api/tweets/get_tweets/:id/ # name='get_tweets'  ## get tweets of user with id (:id)  

    DELETE --> api/tweets/manage_tweet/:id/  # name="manage_tweet" # delete a tweet  
    PUT  --> api/tweets/manage_tweet/:id/  # name='manage_tweet' # edit a tweet  
  
    PUT  --> api/tweets/saved_tweets_list/:id # name='saved_tweets_list' ## add a tweet to saved / remove :: Trigger_Functionality  
    GET  --> api/tweets/get_saved_tweets/ # name='get_saved_tweets'  ## get saved tweets ## only for current user  
    GET  --> api/tweets/get_user_media/:id/ name='get_user_media' 

    PUT  --> api/tweets/liked_tweets_list/:id # name='liked_tweets_list' ## add a tweet to liked list / remove :: Trigger_Functionality  
    GET  --> api/tweets/get_liked/:id/ # name='get_liked'  ## get liked tweets and replies for a user (profile)
    GET  --> api/tweets/get_tweet_like_list/:id/  # name='get_tweet_like_list'  ## return list of people who liked this tweet 

    POST --> api/tweets/retweet_list/:id/   # name='retweet_list'  ## add new retweet
    GET  --> api/tweets/retweet_list/:id/   # name='retweet_list'    ## get retweets list

------------------------------------------  
  
    POST --> api/tweets/replies/replies_list/:id/  # name='replies_list' # add new reply  (id of tweet)  
    GET --> api/tweets/replies/replies_list/:id/  # name='replies_list' # get all replies on a tweet  (id of tweet)  
    GET --> api/tweets/replies/get_user_replies/:id/  #name='get_user_replies'  # get all replies of a user (use with tweets & replies)
    DELETE --> api/tweets/replies/delete/:id/  # name='delete_reply' # remove user's reply on a tweet (id of reply)  
    PUT  --> api/tweets/replies/liked_replies_list/:id/  # name='liked_replies_list'  Trigger  
    GET  --> api/tweets/replies/get_reply_like_list/:id/  name='get_reply_like_list'  

------------------------------------------  

    !!!! TODO !!!!  
    - #1 getting started with front 
    - add 'retweeted' to all GET tweets requests  (show 'retweeted by')  
    - Explore tweets and profiles (based on popularity/followers/relations) + (top, latest, media)
    - Hashtags  

