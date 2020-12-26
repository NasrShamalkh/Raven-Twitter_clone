import React from 'react';
import './tweet.css';
import { connect } from 'react-redux';

//interface based on serializer output
// all the props that need to pass to tweet component
export interface ITweetData {
  tweet_id: number;
  user_id: number;
  username: string;
  alias: string | null;
  content: string | null;
  media: boolean;
  media_url: string | null;
  public: boolean;
  profile_image: string | null;
  timestamp: Date | string;
  number_of_saves: number;
  number_of_likes: number;
  number_of_retweets: number;
  number_of_replies: number;
  liked: boolean;
  retweeted: boolean;
  saved: boolean;
}
type IUserData = {
  user_id: number;
  profile_id: number;
  username: string;
  image_url: string | null;
  alias: string | null;
  mode: string;
  defaultProfileImage: string;
};
interface Props {
  tweet_data: ITweetData;
  user_data: IUserData;
}
const Tweet: React.FC<Props> = (props: Props) => {
  // let fileInput = React.createRef<HTMLInputElement>();
  // const handleReplay = () => {};
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
  return (
    <div className='card'>
      <div id='card_fist_div'>
        <div>
          <img
            id='tweets_profile_image'
            src={
              props.tweet_data.profile_image
                ? props.tweet_data.profile_image
                : props.user_data.defaultProfileImage
            }
          />
        </div>
        <div id='tweet_profile_div'>
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {props.tweet_data.alias
              ? props.tweet_data.alias
              : props.tweet_data.username}
          </span>
          <span style={{ fontSize: '13px', opacity: '0.9' }}>
            {getDate(props.tweet_data.timestamp)}
          </span>
        </div>
      </div>
      <div id='tweet_content_div'>
        {props.tweet_data.content ? <p>{props.tweet_data.content}</p> : ''}
      </div>
      {props.tweet_data.media ? (
        <img className='card-img' src={props.tweet_data.media_url} />
      ) : (
        ''
      )}
      <div id='class_info_div'>
        <p>
          <span className='tweet_info_span'>
            {props.tweet_data.number_of_likes} likes
          </span>{' '}
          <span className='tweet_info_span'>
            {props.tweet_data.number_of_replies} Replies
          </span>{' '}
          <span className='tweet_info_span'>
            {props.tweet_data.number_of_retweets} Retweets
          </span>{' '}
          <span className='tweet_info_span'>
            {props.tweet_data.number_of_saves} Saves
          </span>
        </p>
      </div>
      <div id='tweet_actions' className='d-flex flex-row fs-12'>
        <div className='action_button like p-2 cursor'>
          {props.tweet_data.liked ? (
            <i style={{ color: 'red' }} className='fa fa-heart'></i>
          ) : (
            <i className='far fa-heart'></i>
          )}
          <span className='ml-1'>Like</span>
        </div>
        <div className='action_button like p-2 cursor'>
          <i className='far fa-comment'></i>
          <span className='ml-1'>Reply</span>
        </div>
        <div className='action_button like p-2 cursor'>
          {props.tweet_data.retweeted ? (
            <i style={{ color: 'green' }} className='fas fa-retweet'></i>
          ) : (
            <i className='fa fa-retweet'></i>
          )}
          <span className='ml-1'>Retweet</span>
        </div>
        <div className='action_button like p-2 cursor'>
          {props.tweet_data.saved ? (
            <i className='fa fa-bookmark'></i>
          ) : (
            <i className='far fa-bookmark'></i>
          )}
          <span className='ml-1'>Save</span>
        </div>
      </div>
      {/*---------------- comment section  ----------------+*/}
      {/* <form onSubmit={handleReplay} id='comment_section'>
        <div id='card_fist_div'>
          <div>
          <img
            id='tweets_profile_image'
            src={
              props.user_data.image_url
                ? props.user_data.image_url
                : props.user_data.defaultProfileImage
            }
          />
          </div>
          <textarea
            style={{ resize: 'none', borderRadius: '0' }}
            className='form-control'
          ></textarea>
        </div>
        <div className='mt-2 text-right'>
          <label id='uploadImageLable' className='btn btn-default'>
            <img
              id='image_icon'
              src='http://res.cloudinary.com/nasr-cloudinary/image/upload/v1608923986/Raven%20App/Sed-16-512_nrkb3v.png'
            />{' '}
            <input id='uploadImageInput' type='file' ref={fileInput} hidden />
          </label>
          <button className='btn btn-primary btn-sm shadow-none' type='button'>
            Post comment
          </button>
        </div>
      </form> */}
      {/*---------------- comment section  ----------------+*/}
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
  return { user_data };
};

export default connect(mapStateToProps, null)(Tweet);