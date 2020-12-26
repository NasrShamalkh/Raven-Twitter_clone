import React from 'react';
import NavBar from '../navBar/navbar';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';
import axiosInstance from '../axiosApi/axiosApi';
import axios from 'axios';
import Tweet from '../tweet/tweet';
import { useDispatch } from 'react-redux';
import { ITweetData } from '../tweet/tweet';

import './home.css';
interface IUserData {
  user_id: number;
  profile_id: number;
  username: string;
  image_url: string | null;
  alias: string | null;
  mode: string;
  defaultProfileImage: string;
}

interface IDisplayedTweets {
  tweets_data: ITweetData[];
}
interface Props {
  user_data: IUserData;
  displayed_tweets: IDisplayedTweets;
}
// upload image and post tweet on submit of form
const Home: React.FC<Props> = (props: Props) => {
  const [tweetContent, setTweetContent] = React.useState<string>('');
  const [imageUrl, setImageUrl] = React.useState<string>('');
  const [viewType, setViewType] = React.useState<string>('public');
  const [finished, setFinished] = React.useState<boolean>(false);
  const [rerender, setRerender] = React.useState<boolean>(false);
  const dispatch = useDispatch();
  // createRef to create a Refrence to the html element that contains the upload file
  let fileInput = React.createRef<HTMLInputElement>();
  // let tweet_data = {
  ///--------------------Fetching tweets data ------------------------------//
  React.useEffect(() => {
    axiosInstance
      .get('api/tweets/tweets_list/')
      .then(res => {
        const data = res.data;
        const sort = data => {
          return data.sort((x, y) => {
            return (
              Number(new Date(y.timestamp)) - Number(new Date(x.timestamp))
            );
          });
        };
        dispatch(actions.setDisplayedTweets(sort(data)));
      })
      .catch(err => {
        console.log('Error in getting tweets');
        dispatch(actions.setDisplayedTweets([]));
      });
  }, [rerender]);

  //----------------------------------------

  const handleSubmit = event => {
    event.preventDefault();
    const file = fileInput.current.files[0];
    if (!tweetContent && !file) {
      alert('You cannot post an empty Tweet !');
      return;
    }
    // only make the request if an image is provided
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ravenapp');
    axios
      .post(
        'https://api.Cloudinary.com/v1_1/nasr-cloudinary/image/upload',
        formData
      )
      .then(res => {
        setImageUrl(res.data.url);
        setFinished(true);
      })
      .catch(err => {
        setFinished(true);
      });
  };
  // if it finished then the image url is difinitly set ( or not )
  if (finished) {
    setFinished(false);
    var isPublic = viewType == 'public' ? true : false;
    let have_media = imageUrl ? true : false;
    var post_data;
    if (have_media) {
      post_data = {
        content: tweetContent,
        media: true,
        media_url: imageUrl,
        public: isPublic
      };
    } else {
      post_data = {
        content: tweetContent,
        public: isPublic
      };
    }
    axiosInstance
      .post('api/tweets/tweets_list/', post_data)
      .then(res => {
        alert('Tweet posted !');
        setRerender(!rerender);
      })
      .catch(err => {
        alert('Error in posting tweet ');
      });
    // resetting everything
    setTweetContent('');
    setImageUrl('');
    setViewType('public');
    setFinished(false);
  }
  const getGreeting = () => {
    var hr = new Date().getHours();
    if (hr >= 17 && hr < 24) {
      return 'Buenos Noches';
    } else {
      return 'Buenos Días';
    }
  };
  return (
    <div>
      <NavBar />
      <div>
        <div id='first_container' className='container'>
          <form onSubmit={handleSubmit} className='form-group'>
            <label htmlFor='tweet_input'>Share your thoughts</label>
            <div id='profile-textarea'>
              <img
                id='home_profile_image'
                src={
                  props.user_data.image_url
                    ? props.user_data.image_url
                    : props.user_data.defaultProfileImage
                }
              />
              <textarea
                className='form-control'
                id='tweet_input'
                placeholder={getGreeting()}
                value={tweetContent}
                onChange={e => {
                  setTweetContent(e.target.value);
                }}
              ></textarea>
            </div>
            <div id='post_tweet_div_02'>
              <label id='uploadImageLable' className='btn btn-default'>
                <img
                  id='image_icon'
                  src='http://res.cloudinary.com/nasr-cloudinary/image/upload/v1608923986/Raven%20App/Sed-16-512_nrkb3v.png'
                />{' '}
                <input
                  id='uploadImageInput'
                  type='file'
                  ref={fileInput}
                  hidden
                />
              </label>
              <select
                id='inputState'
                className='form-control tweet_select'
                value={viewType}
                onChange={e => {
                  setViewType(e.target.value);
                }}
              >
                <option value={'public'} id='everyone_can_see' defaultChecked>
                  Everyone can see
                </option>
                <option value={'private'} id='followers_only'>
                  Followers only
                </option>
              </select>
              <div id='button_div'>
                <button
                  id='submit_button'
                  type='submit'
                  className='btn btn-primary'
                >
                  Tweet
                </button>
              </div>
            </div>
          </form>
        </div>
        <div id='tweets_container' className='container'>
          {props.displayed_tweets.tweets_data.length == 0 ? (
            <p>Sorry not tweets, try to follow profiles</p>
          ) : (
            props.displayed_tweets.tweets_data.map((tweet, index) => {
              let tweet_data: ITweetData = tweet;
              return <Tweet key={index} tweet_data={tweet_data} />;
            })
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  const user_data = {
    user_id: state.current_user_reducer.user_id,
    profile_id: state.current_user_reducer.profile_id,
    username: state.current_user_reducer.username,
    image_url: state.current_user_reducer.image_url,
    alias: state.current_user_reducer.alias,
    mode: state.current_user_reducer.mode,
    defaultProfileImage: state.current_user_reducer.defaultProfileImage
  };
  const displayed_tweets = state.displayed_tweets_reducer;
  return { user_data, displayed_tweets };
};

export default connect(mapStateToProps, null)(Home);
