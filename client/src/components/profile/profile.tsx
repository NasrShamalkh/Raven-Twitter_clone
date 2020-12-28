import React from 'react';
import './profile.css';
import { connect } from 'react-redux';
import axiosInstance from '../axiosApi/axiosApi';
import NavBar from '../navBar/navbar';
import { Link } from 'react-router-dom';
import Tweet from '../tweet/tweet';
import { ITweetData } from '../tweet/tweet';
import ProfileBrief from '../profileBrief/profileBrief'
import { IProfileBrief } from '../profileBrief/profileBrief'
import {useDispatch} from 'react-redux';
import * as actions from '../../redux/actions';
import $ from 'jquery';

interface Props {
  user_id: number | string;
  default_profile_image: string;
  current_user_id: number | string;
}

export interface IProfile {
  username: string;
  id: string | number;
  user_id: string | number;
  email: string;
  alias: string | null;
  bio: string | null;
  date_of_birth: string | Date;
  image_url: string | null;
  background_image_url: string | null;
  date_joined: string | Date;
  number_of_followers: string | number;
  number_of_following: string | number;
  number_of_likes: string | number;
  number_of_tweets: string | number;
  number_of_tweets_and_replies: string | number;
  number_of_media: string | number;
  following: boolean;
}
let init_state: IProfile = {
  username: '',
  id: '',
  user_id: '',
  email: '',
  alias: '',
  bio: '',
  date_of_birth: '',
  date_joined: '',
  image_url: '',
  background_image_url: '',
  number_of_followers: '',
  number_of_following: '',
  number_of_likes: '',
  number_of_tweets: '',
  number_of_tweets_and_replies: '',
  number_of_media: '',
  following: false
};

const profile_brief_init = {
  id: '',
  username: '',
  user_id: '',
  number_of_followers: '',
  image_url: '',
  related: [],
  alias: ''
}

const Profile: React.FC<Props> = (props: Props) => {
  const [profile_data, set_profile_data] = React.useState<IProfile>(init_state);
  const [tweets, setTweets] = React.useState([]);
  const [endPoint, setEndPoint] = React.useState<string | null>(null);
  const [rerender, setRerender] = React.useState<boolean>(false);
  const [followers, setFollowers] = React.useState<Array<IProfileBrief>>([profile_brief_init]);
  const [following, setFollowing] = React.useState<Array<IProfileBrief>>([profile_brief_init]);
  const dispatch = useDispatch()

  const forceRerender = () => {
    setRerender(!rerender)
  }

  const getDate = timestamp => {
    let date = new Date(timestamp);
    let day = date.getDate();
    let year = date.getFullYear();
    let month = date.getMonth();
    function getMonth(month) {
      switch (month) {
        case 0:
          return 'Jan';
        case 1:
          return 'Feb';
        case 2:
          return 'Mar';
        case 3:
          return 'Apr';
        case 4:
          return 'May';
        case 5:
          return 'Jun';
        case 6:
          return 'Jul';
        case 7:
          return 'Aug';
        case 8:
          return 'Sep';
        case 9:
          return 'Oct';
        case 10:
          return 'Nov';
        case 11:
          return 'Dec';
      }
    }
    return `${day}/${getMonth(month)}/${year}`;
  };

  // for sorting tweets and replies all together
    const sortTweets = tweet_data => {
      return tweet_data.sort((x, y) => {
        if(x.timestamp && y.timestamp) {
          return (
            Number(new Date(y.timestamp)) - Number(new Date(x.timestamp))
          );
        }else if(x.reply) {
          return (
            Number(new Date(y.timestamp)) - Number(new Date(x.reply.timestamp))
          );
        }else {
          return (
            Number(new Date(y.reply.timestamp)) - Number(new Date(x.timestamp))
          );
        }
      });
  }

  React.useEffect(() => {
    axiosInstance
      .get(`api/profiles/view_profile/${props.user_id}/`)
      .then(res => {
        // even without user_id (on refresh) the request goes throught but returns an HTML page (the React app)
        // if so ===>> fire up Plan B
        if (res.headers['content-type'] == 'text/html; charset=utf-8') {
          reloadFallback(localStorage.getItem('profile_user_id'));
        }
        let data: IProfile = res.data;
        set_profile_data(data);
        setEndPoint('get_tweets');
      })
      .catch(err => {
        console.log('Error in fetching profile data', err);
        alert('Error in fetching profile data');
      });
  }, [props.user_id, rerender]);

  React.useEffect(() => {
    if (endPoint && profile_data) {
      axiosInstance
        .get(`api/tweets/${endPoint}/${profile_data.user_id}/`)
        .then(res => {
          setTweets(sortTweets(res.data));
        })
        .catch(err => {
          console.log('Error in getting data');
          setTweets([]);
        });
    }
  }, [endPoint, profile_data]);

  // plan B get user_id from the localStorage (which is stored on actions dispatch ) BOOOO YAAAAA
  const reloadFallback = user_id => {
    axiosInstance
      .get(`api/profiles/view_profile/${user_id}/`)
      .then(res => {
        let data: IProfile = res.data;
        set_profile_data(data);
        setEndPoint('get_tweets');
      })
      .catch(err => {
        console.log(
          'Error in fetching profile data from fallback function',
          err
        );
        alert('Error in fetching profile data');
      });
  };

  const handleFollowTrigger = () => {
    axiosInstance
      .put(`api/profiles/follow_status/${profile_data.id}/`)
      .then(res => {
        setRerender(!rerender);
      })
      .catch(err => {
        console.log('Error while trying to follow profile', err);
      });
  };

  // this is put in a useEffect because I cant find a way to dealy modal pop untill data fetching
  React.useEffect(() => {
    if(profile_data.id) {
       //get followers 
       axiosInstance
       .get(`api/profiles/get_followers/${profile_data.id}/`)
       .then(res => {
         setFollowers(res.data);
       })
       .catch(err => {
         setFollowers([]);
         console.log('Error in getting followers', err);
       });
       //get following
        axiosInstance
       .get(`api/profiles/get_following/${profile_data.id}/`)
       .then(res => {
         setFollowing(res.data);
       })
       .catch(err => {
         setFollowing([]);
         console.log('Error in getting Following data', err);
       });
    }
   


  }, [profile_data, rerender])
    
  return (
    <div>
      <NavBar />
      <div id='profile_div'>
        <div className='bg-white shadow rounded overflow-hidden'>
          <div className='cover'>
            <img
              id='cover_image'
              className=' img-fluid'
              src={
                profile_data.background_image_url
                  ? profile_data.background_image_url
                  : 'https://images.unsplash.com/photo-1595855524159-6a89fe9fa0f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=500&q=60'
              }
            />
          </div>
          <div className='profile'>
            <div id='profile_image_div'>
              <div
                style={{
                  border: '2xp solid black',
                  borderRadius: '10px'
                }}
              >
                <img
                  id='profile-profile_image '
                  src={
                    profile_data.image_url
                      ? profile_data.image_url
                      : props.default_profile_image
                  }
                  alt='...'
                  width='175'
                  height='175'
                  className='rounded img-thumbnail'
                  style={{
                    border: '2xp solid black',
                    borderRadius: '10px'
                  }}
                />
              </div>
            </div>
            <div id='profile_statics_div' className=' p-4 d-flex '>
              <div id='profile_info_div'>
                <h5
                  style={{
                    fontSize: '28px',
                    fontFamily: 'arial',
                    fontWeight: 'bold'
                  }}
                >
                  <i className='fas fa-at'></i>
                  {profile_data.username}
                </h5>
                <p
                  style={{
                    marginBottom: '1px'
                  }}
                >
                  {profile_data.alias ? (
                    <span>
                      <i className='fas fa-user-circle'>
                        {' '}
                        {profile_data.alias}
                      </i>
                    </span>
                  ) : (
                    ''
                  )}
                </p>
                {profile_data.date_of_birth ? (
                  <i className='fa fa-birthday-cake' aria-hidden='true'></i>
                ) : (
                  ''
                )}
                <small>
                  {profile_data.date_of_birth ? (
                    <span> {getDate(profile_data.date_of_birth)}</span>
                  ) : (
                    ''
                  )}
                </small>
                <br />
                <i className='fas fa-envelope'></i>{' '}
                <small>
                  <i>{profile_data.email}</i>
                </small>
                <br></br>
                <i className='fa fa-info-circle' aria-hidden='true'></i> {' '}
                <small>
                  {profile_data.bio ? (
                    <span> Bio: {profile_data.bio}</span>
                  ) : (
                    <span> No Bio yet</span>
                  )}
                </small>
                <br></br>
                <i className='fa fa-calendar' aria-hidden='true'></i>{' '}
                <small> Date Joined: {getDate(profile_data.date_joined)}</small>
              </div>
              {!(props.current_user_id == props.user_id) ? (
                <div>
                  <div id='follow_status'>
                    {profile_data.following ? (
                      <div>
                        <img
                          src='https://res.cloudinary.com/nasr-cloudinary/image/upload/v1609048452/Raven%20App/follow_following_twitter_icon-1320196031920300840_oi7guk.png'
                          alt='...'
                        />
                        <button
                          className='dropdown-toggle btn btn-success'
                          type='button'
                          id='followingMenuButton'
                          data-toggle='dropdown'
                          aria-haspopup='true'
                          aria-expanded='false'
                        >
                          Following
                        </button>
                        <div
                          className='dropdown-menu'
                          aria-labelledby='followingMenuButton'
                        >
                          <a
                            style={{
                              cursor: 'pointer'
                            }}
                            onClick={handleFollowTrigger}
                            className='dropdown-item'
                          >
                            Unfollow
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <img
                          alt='...'
                          src='https://res.cloudinary.com/nasr-cloudinary/image/upload/v1609048471/Raven%20App/JD-27-512_aavneb.png'
                        />
                        <button
                          className='dropdown-toggle btn btn-primary'
                          type='button'
                          id='followMenuButton'
                          data-toggle='dropdown'
                          aria-haspopup='true'
                          aria-expanded='false'
                        >
                          Follow
                        </button>
                        <div
                          className='dropdown-menu'
                          aria-labelledby='followMenuButton'
                        >
                          <a
                            onClick={handleFollowTrigger}
                            style={{
                              cursor: 'pointer'
                            }}
                            className='dropdown-item'
                          >
                            Follow
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                ''
              )}
              <ul id='follow_statics' className='list-inline mb-0'>
                <li
                  style={{
                    marginRight: '20px'
                  }}
                  className='list-inline-item show_followers'
                  data-toggle='modal'
                  data-target='#show_followers_modal'
                >
                  <h5 className='font-weight-bold mb-0 d-block'>
                    {profile_data.number_of_followers}
                  </h5>
                  <small className='text-muted'>
                    {' '}
                    <i className='fas fa-user mr-1'></i>Followers
                  </small>
                </li>
                <li
                  className='list-inline-item show_followers'
                  data-toggle='modal'
                  data-target='#show_following_modal'
                >
                  <h5 className='font-weight-bold mb-0 d-block'>
                    {profile_data.number_of_following}
                  </h5>
                  <small className='text-muted'>
                    {' '}
                    <i className='fas fa-user mr-1'></i>Following
                  </small>
                </li>
                <div>
                  {props.current_user_id == props.user_id ? (
                    <div id='edit_button'>
                      <Link
                        to='/settings'
                        className='btn btn-outline-dark btn-sm btn-block'
                      >
                        <span
                          style={{
                            color: 'wheat',
                            fontSize: '20px'
                          }}
                        >
                          Edit Profile
                        </span>
                      </Link>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          justifyContent: 'center'
        }}
        id='profile_large_div'
      >
        <div id='M_sidebar' className='sidebar'>
          <a
            onClick={() => {
              setEndPoint('get_tweets');
            }}
          >
            Tweets{' '}
            <span className='staticNumber'>
              {profile_data.number_of_tweets}
            </span>
          </a>
          <a
            onClick={() => {
              setEndPoint('replies/get_user_tweets_and_replies');
            }}
          >
            Tweets & replies{' '}
            <span className='staticNumber'>
              {profile_data.number_of_tweets_and_replies}
            </span>
          </a>
          <a
            onClick={() => {
              setEndPoint('get_user_media');
            }}
          >
            Media{' '}
            <span className='staticNumber'>{profile_data.number_of_media}</span>
          </a>
          <a
            onClick={() => {
              setEndPoint('get_liked');
            }}
          >
            Likes{' '}
            <span className='staticNumber'>{profile_data.number_of_likes}</span>
          </a>
        </div>
        <div id='tweets_container' className='container'>
          {tweets.length == 0 ? (
            <p className="no_content">No Tweets yet</p>
          ) : (
            tweets.map((tweet, index) => {
              // here we might have tweets + replies
              if (tweet.tweet) {
                let tweet_data: ITweetData = tweet.tweet;
                return (
                  <Tweet 
                  forceRerender={forceRerender}
                    key={index}
                    reply_data={tweet.reply}
                    tweet_data={tweet_data}
                    profile_data={profile_data}
                  />
                );
              } else {
                let tweet_data: ITweetData = tweet;
                return (
                  <Tweet 
                  forceRerender={forceRerender}
                    profile_data={profile_data}
                    key={index}
                    tweet_data={tweet_data}
                  />
                );
              }
            })
          )}
        </div>
      </div>
      {/*------------      HIDDEN        -------------*/}
      <div
        className='modal fade'
        id='show_followers_modal'
        role='dialog'
        aria-labelledby='show_followers_modal_title'
        aria-hidden='true'
      >
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='show_followers_modal_title'>
                FOLLOWERS
              </h5>

              <button
                type='button'
                className='close'
                data-dismiss='modal'
                aria-label='Close'
              >
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <div className='modal-body'>
              <ul className='list-group list-group-flush'>
                {followers.length > 0? (
                  followers.map((profile, index) => {
                    const profile_brief_data: IProfileBrief = profile
                    return (
                      <Link data-dismiss='modal' key={index} to='/profile'
                      onClick={() => {
                        console.log('This should go to user', profile.username);
                          dispatch(actions.setShowProfileId(profile.user_id));
                      }}
                      >
                    <ProfileBrief  {...profile_brief_data}/>
                    </Link>
                    )
                  })
                ) : 'No followers yet'}
              </ul>
            </div>
            <div className='modal-footer'>
              <button 
              id='close_button'
                type='button'
                className='btn btn-secondary'
                data-dismiss='modal'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*-------------------------*/}
      {/*------------      HIDDEN        -------------*/}
      <div
        className='modal fade'
        id='show_following_modal'
        role='dialog'
        aria-labelledby='show_following_modal_title'
        aria-hidden='true'
      >
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='show_following_modal_title'>
                FOLLOWING
              </h5>

              <button
                type='button'
                className='close'
                data-dismiss='modal'
                aria-label='Close'
              >
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <div className='modal-body'>
              <ul className='list-group list-group-flush'>
                {following.length > 0
                  ? (following.map((profile, index) => {
                    const profile_brief_data: IProfileBrief = profile
                    return (
                      <Link data-dismiss='modal' key={index} to='/profile'
                      onClick={() => {
                        console.log('This should go to user', profile.username);
                          dispatch(actions.setShowProfileId(profile.user_id));
                      }}
                      >
                    <ProfileBrief  {...profile_brief_data}/>
                    </Link>
                    )
                    })
                  ) : 'Not following anyone yet'}
              </ul>
            </div>
            <div className='modal-footer'>
              <button 
              id='close_button'
                type='button'
                className='btn btn-secondary'
                data-dismiss='modal'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*-------------------------*/}
    </div>
  );
};

const mapStateToProps = state => {
  const user_id = state.display_reducer.show_profile_user_id;
  const default_profile_image = state.current_user_reducer.defaultProfileImage;
  const current_user_id = state.current_user_reducer.user_id;
  return { user_id, default_profile_image, current_user_id };
};
export default connect(mapStateToProps, null)(Profile);
