# Raven
Raven App is a [*Twitter*](https://twitter.com/) clone app. Built by Web Developer [*Nasr Shamalkh*](https://github.com/NasrShamalkh).

## Table of content
1. [Description](#description)
2. [Installation](#installation)
    * [Pre-installation](#pre-installation-requirements)
    * [Installation](#installation-1)
3. [Technologies & Explanation](#technologies--explanation)
    * [Backend](#backend)
    * [Frontend](#frontend)
    * [image Upload](#image-upload)
4. [Key files and folders](#key-files)
5. [Usage](#usage)
6. [Docker](#docker)
7. [Deployment](#deployment-link)
## Description
This applications is built as an attempt to rebuild Twitter with a different style and functionality for educational & Training puroposes.  
This projects is one of the many challenges on [*DevChallenges.io*](https://devchallenges.io/challenges/rleoQc34THclWx1cFFKH), instructions on the challenge are provided in the link. 

## Installation
> For a faster installation experience check the [Docker](#docker-image) section bellow.
### pre-installation requirements
Before being able to run this project, you need to have these installed on your machine.  
* [Python3](https://www.python.org/downloads/) & Pip.
* [Pipenv](https://pypi.org/project/pipenv/).
* [Node](https://nodejs.org/en/download/) & npm.
* [MySql](https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/) & MySql server.
 #### Installation.
 1. Clone this repo.
 2. Run `pipenv shell` in the root directory to create a virtural env.
 3. Run `pipenv install` after the environment is all set to install the packages.
 4. `cd client` to get into the client directory and run `npm install`.
 5. After installing the packages we need to run our database migrations.
    - First, we need to create a local MySQL database.  
      - Go to MySQL Command Line client and create a database. *Follow bellow steps:*
      1. Enter your user password in the command line.
      2. <code>CREATE DATABASE raven_db;</code>
      3. Add your <code>USER</code> and <code>PASSWORD</code> in settings.py + ( add your <code>PORT</code> if you have anything other than the default 3306 ), also in <code>HOST</code> use 'db' for Docker or 'localhost' for regular installation.   
    - Make sure you're in the root directory ( where manage.py is ) and then run `python manage.py migrate`
    - We also need to create a superuser, make sure you're in the root directory then:
      1. <code>python manage.py createsuperuser</code> and follow the process to create the first user.
 5. Now that you've installed the packages, created a superuser and ran the migrations, you have two options for running the app.
    1. __Development__.  
    Open two terminal windows, one for the Frontend ( in the client directory) and the other for the Backend ( in the root directory ).
    - In the backend terminal run `pipenv shell` & `python manage.py runserver`.
    - And in the frontend terminal run `npm run dev`.  
     Now you have two running servers, you can find the app running on port 3000 and the backend server running on port 8000.
    2. __Production__.  
    Open one terminal window in the root and run `cd client && npm run build` after the build is finished run `cd ..`  
    Now that you are in the root run `python manage.py runserver`. You can find the app running on the backend server on port 8000.  
    *Important note*   
    For the app to work properly ( because it is still in developement), you have to do the following:  
    > 1. when the app is up ad running go to django admin page (localhost:8000/admin) and login with the superuser.  
    > 2. go to proilfes tab.  
    > 3. click on "add profile" in the top right corner.  
    > 4. in the user space select your superuser username.  
    > 5. select whatever other data you want.  
    > 6. once you're done, select save.  

## Technologies & Explanation
#### Backend
- [Django](https://www.djangoproject.com/) as the main backend app with [djangorestframework](https://www.django-rest-framework.org/) package to build the api.
- [django-cors-headers](https://pypi.org/project/django-cors-headers/) to handle cross-site requests during developemnt ( not needed in production ).
- MySql as the main database for the app.
- Used [SimpleJWT](https://pypi.org/project/djangorestframework-simplejwt/) to handle tokens and user authentication.
- [Pipenv](https://pypi.org/project/pipenv/) to handle python env and as a python package manager.
- [MySql client](https://pypi.org/project/mysqlclient/) to connect to MySql server.

#### Frontend
- [React](https://reactjs.org/) & React router for building the main Frontend app.
- [Typescript](https://www.typescriptlang.org/) to provide static typing properties during development.
- [Redux](https://redux.js.org/) to handle global state and [react-redux](https://react-redux.js.org/) to connect the two.
- Used [Webpack](https://webpack.js.org/) as the main complier fot the project and [Babel](https://babeljs.io/) to transpile the code.
- [Axios](https://www.npmjs.com/package/axios) to handle requests.
- [Bootstrap](https://getbootstrap.com/) and [JQuery](https://jquery.com/).

#### Image upload
- This app uses [Cloudinary](http://cloudinary.com/) for image upload and backup.

##  Key files.
This project contains 5 main folders.  
* [raven](https://github.com/NasrShamalkh/Raven-Twitter_clone/tree/main/raven)
    * The main folder for the django configuration, it continers the settings.py file and the main urls.py
* [tweets](https://github.com/NasrShamalkh/Raven-Twitter_clone/tree/main/tweets)
    * It containes all the models and the relations for the tweets and replies, it also containes all of its functionality, routes and serializers.
* [profiles](https://github.com/NasrShamalkh/Raven-Twitter_clone/tree/main/profiles)
    * It containes all the models and the relations for the Pofiles, it also containes all of its functionality, routes and serializers.
* [client](https://github.com/NasrShamalkh/Raven-Twitter_clone/tree/main/client) 
    * The main client directory. It has all of the frontend code ( the react-typescript application ) 
        * `src`: the source code ( Frontend ).
        * `static`: build output ( will be available only after build).
        * `templates`: it containes a `client/index.html` file which is only the file that is served by the main `view`.
            > the `<script>` tag in this file links to the build `bundle.js` file.
        * `configs`: main configuration for Webpack (dev/prod).
* [auth_app](https://github.com/NasrShamalkh/Raven-Twitter_clone/tree/main/auth_app) 
    * This directory containes all of the functionality regarding user management and authentication. 
* [api_uls.md](https://github.com/NasrShamalkh/Raven-Twitter_clone/blob/main/api_ulrs.md).
    * This file helped through development as it containes all of the api routes and how to interact with them.


## Usage
* At the start of the app, if you already have a profile you will be redirected to the homepage ( if you're logged in ). And if not you will face two options either to **Login** or to **Register** with a new account.
> 'Logout' and 'Logout from all' is done from a dropdown menu next to the user profile image in the NavBar.
* You can navigate between four pages:
    - **Homepage**: where all of the tweets and retweets from the people you follow are. On this page you can also add your own tweets ( after adding, a pop up will show telling you that your tweet is added ).
    - **Explore**: it contains profile suggestions and tweets from people you dont follow ( you can sort them by Top/Media/Latest), and you can search for users by thier usernames(@username) or by their aliases(alias).
    - **Bookmarkds**: it contains the tweets you saved and you can sort them by media.
    - **Settings**: this is where you controle your profile ( auth app )
* Every user has a **Profile** page that containes all of the info regarding that user where you can follow/unfollow them. You can also view thier followers list and the people they follow.  
in the profile page you can view the user's tweets, tweets & replies, media and liked tweets & replies.
* ***Tweets***  
You can do various operations with tweets. You can like, save or retweet a tweet and you can also Reply on a tweet.  
If you wish to reply you can press on the reply icon or the   (`+`) on the top, where you will be taken to a page where you can view the tweet.  
In this page you can see the people who liked and retweeted this tweet, you can also reply on it and see all of the replies. Plus, if you are the owner of the tweet can delete it ( a button will show on top if you're the owner ). 

## Video walkthrough  
Click [here](https://drive.google.com/file/d/1tpsjG0L2K3oaUJt6JYMieAgTPyV8WhBP/view?usp=sharing) for video.  

## Docker
The fastest way to test this app is to use [Docker](https://docs.docker.com/).  
Before starting you need to have:  
1. Docker (.... Didn't see that coming huh ?).   
2. [docker-compose](https://docs.docker.com/compose/).   
3. Please be sure nothing is running on ports 6060 & 3306.   
Only one thing to handle all the complexity mentioned in the installation part:  
* After cloning the repo, be sure you're in the root directory and then use <code>docker-compose up</code> and you're good to go on port 6060.  
    * This will create an image for our application.
    * you will find the application running on port 8000 =>(http://localhost:8000/)
    * Also, images will be pulled from DockerHub include [nikolaik/python-nodejs](https://hub.docker.com/r/nikolaik/python-nodejs) and moriadb.
* Moriadb is used in production instaed of Mysql. They're both similar and made by same developers.
* I used Moriadb for its high performance, light weight and speed.
    * Check out this [article](https://www.guru99.com/mariadb-vs-mysql.html) if you're intreasted in knowing more about their differences.  
* > The process will take sometime depending on your internet connection and computer speed.
* Now, enjoy the app. Continue from [Usage](#usage) part.  

## Deployment link
- [ ] coming soon.


