import React from 'react';
import NavBar from '../navBar/navbar';
import { connect } from 'react-redux';
import axiosInstance from '../axiosApi/axiosApi';
import axios from 'axios';

import './home.css';
interface Props {
  user_id: number;
  profile_id: number;
  username: string;
  image_url: string | null;
  alias: string | null;
  mode: string;
}
// upload image and post tweet on submit of form
const Home: React.FC<Props> = (props: Props) => {
  const [tweetContent, setTweetContent] = React.useState<string>('');
  const [imageUrl, setImageUrl] = React.useState<string>('');
  const [viewType, setViewType] = React.useState<string>('public');
  const [finished, setFinished] = React.useState<boolean>(false);
  // createRef to create a Refrence to the html element that contains the upload file
  let fileInput = React.createRef<HTMLInputElement>();

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
                  props.image_url
                    ? props.image_url
                    : 'https://res.cloudinary.com/nasr-cloudinary/image/upload/v1608924149/Raven%20App/istockphoto-93394538-612x612_gui0vc.jpg'
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
        <div className='container'>
          <h2>second conteiner</h2>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user_id: state.user_id,
    profile_id: state.profile_id,
    username: state.username,
    image_url: state.image_url,
    alias: state.alias,
    mode: state.mode
  };
};

export default connect(mapStateToProps, null)(Home);
