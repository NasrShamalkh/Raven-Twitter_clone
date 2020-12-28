import './viewTweet.css';
import React from 'react';
import NavBar from '../navBar/navbar';
import { useDispatch, connect } from 'react-redux';
import axiosInstance from '../axiosApi/axiosApi';
import * as actions from '../../redux/actions';
import Tweet from '../tweet/tweet';
import Reply from '../reply/reply';
import axios from 'axios';
import { S_ProfileBrief } from '../profileBrief/profileBrief';

interface Props {
  viewed_tweet_id: string | number;
  user_id: string | number;
  profile_id: string | number;
  username: string;
  image_url: string | null;
  defaultProfileImage: string;
}

const ViewTweet: React.FC<Props> = (props: Props) => {
  const [likeList, setLikeList] = React.useState([]);
  const [retweetList, setRetweetList] = React.useState([]);
  const [replies, setReplies] = React.useState([]);
  const [rerender, setRerender] = React.useState<boolean>(false);
  const [tweet, setTweet] = React.useState();
  const [replyContent, setReplyContent] = React.useState<string>('');
  const [finished, setFinished] = React.useState<boolean>(false);
  const [imageUrl, setImageUrl] = React.useState<string>('');
  const dispatch = useDispatch();
  let fileInput = React.createRef<HTMLInputElement>();

  React.useEffect(() => {
    axiosInstance
      .get(`api/tweets/get_tweet/${props.viewed_tweet_id}/`)
      .then(res => {
        if (res.headers['content-type'] == 'text/html; charset=utf-8') {
          reloadFallback(localStorage.getItem('viewed_tweet_id'));
        } else {
          setTweet(res.data);
        }
      })
      .catch(err => console.error('Error in getting tweet data', err));
  }, [props.viewed_tweet_id, rerender]);

  React.useEffect(() => {
    // ------------ get tweet retweet list
    axiosInstance
      .get(`api/tweets/get_tweet_like_list/${props.viewed_tweet_id}/`)
      .then(res => {
        // res.data is profilesbrief
        if (res.headers['content-type'] !== 'text/html; charset=utf-8') {
          setLikeList(res.data);
        }
      })
      .catch(err => console.error('Error in getting tweets like list', err));

    // -------------- get tweet like list
    axiosInstance
      .get(`api/tweets/retweet_list/${props.viewed_tweet_id}/`)
      .then(res => {
        // res.data is profilesbrief
        if (res.headers['content-type'] !== 'text/html; charset=utf-8') {
          setRetweetList(res.data);
        }
      })
      .catch(err => console.error('Error in getting retweets list', err));

    // ------------- GET REPLIES ------------
    axiosInstance
      .get(`api/tweets/replies/replies_list/${props.viewed_tweet_id}/`)
      .then(res => {
        // to git rid of unanted response due to refresh ==> on refresh there is no user_id from redux store thus we get it from the fallback (localstorage) and dispatch it causing multiple rerenders
        if (res.headers['content-type'] !== 'text/html; charset=utf-8') {
          const data = res.data;
          const sort = data => {
            return data.sort((x, y) => {
              return (
                Number(new Date(y.timestamp)) - Number(new Date(x.timestamp))
              );
            });
          };
          setReplies(sort(data));
        }
      })
      .catch(err => {
        console.error('Error in getting replies', err);
        setReplies([]);
      });
  }, [rerender, props.viewed_tweet_id, tweet]);

  const reloadFallback = tweet_id => {
    axiosInstance
      .get(`api/tweets/get_tweet/${tweet_id}/`)
      .then(res => {
        setTweet(res.data);
        setRerender(!rerender);
        dispatch(actions.setViewedTweet(res.data.tweet_id));
      })
      .catch(err =>
        console.error('Error in getting tweet data from fallback', err)
      );
  };

  const forceRerender = () => {
    setRerender(!rerender);
  };

  const handleReplay = e => {
    e.preventDefault();
    const file = fileInput.current.files[0];
    if (!replyContent && !file) {
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

  if (finished) {
    setFinished(false);
    let have_media = imageUrl ? true : false;
    var post_data;
    if (have_media) {
      post_data = {
        content: replyContent,
        media: true,
        media_url: imageUrl
      };
    } else {
      post_data = {
        content: replyContent
      };
    }
    axiosInstance
      .post(
        `api/tweets/replies/replies_list/${props.viewed_tweet_id}/`,
        post_data
      )
      .then(res => {
        alert('Reply Posted !');
        setRerender(!rerender);
      })
      .catch(err => {
        alert('Error in posting reply ');
      });
    // resetting everything
    setReplyContent('');
    setImageUrl('');
    setFinished(false);
  }
  return (
    <div>
      <NavBar />
      {/* ------------------------- LEFT LIST ------------------- */}
      <div
        style={{
          height: '100%',
          width: '250px',
          position: 'fixed'
        }}
        className='sidebar'
      >
        <h1
          style={{
            textAlign: 'center',
            fontSize: '24px',
            fontFamily: 'revert'
          }}
        >
          <i>Liked By:</i>{' '}
        </h1>
        <div
          id='side_content'
          style={{
            height: '80%',
            border: '1px solid black',
            overflow: 'auto'
          }}
        >
          {likeList.length > 0 ? (
            likeList.map((profile, index) => {
              return <S_ProfileBrief key={index} {...profile} />;
            })
          ) : (
            <p style={{ textAlign: 'center' }}>
              <i>No likes yet</i>
            </p>
          )}
        </div>
      </div>

      {/* ------------------------- RIGHT LIST ------------------- */}

      <div
        style={{
          height: '100%',
          width: '250px',
          position: 'fixed',
          right: '0'
        }}
        className='sidebar'
      >
        <h1
          style={{
            textAlign: 'center',
            fontSize: '24px',
            fontFamily: 'revert'
          }}
        >
          <i>Retweeted By:</i>{' '}
        </h1>
        <div
          id='side_content'
          style={{
            height: '80%',
            border: '1px solid black',
            overflow: 'auto'
          }}
        >
          {retweetList.length > 0 ? (
            retweetList.map((profile, index) => {
              return <S_ProfileBrief key={index} {...profile} />;
            })
          ) : (
            <p style={{ textAlign: 'center' }}>
              <i>No Retweets yet</i>
            </p>
          )}
        </div>
      </div>

      <div>
        <div style={{
            border: '2px solid #000033',
            marginBottom: '10px'
        }} className='container'>
          {tweet ? (
            <Tweet forceRerender={forceRerender} tweet_data={tweet} />
          ) : (
            ''
          )}
          {/*---------------- comment section  ----------------+*/}
          <form onSubmit={handleReplay} id='comment_section'>
            <div id='card_fist_div'>
              <div>
                <img
                  id='tweets_profile_image'
                  src={
                    props.image_url
                      ? props.image_url
                      : props.defaultProfileImage
                  }
                />
              </div>
              <textarea
                style={{
                  resize: 'none',
                  borderRadius: '10px',
                  width: '80%',
                  height: '50px',
                  borderColor: '#000033'
                }}
                className='form-control'
                value={replyContent}
                onChange={e => {
                  setReplyContent(e.target.value);
                }}
              ></textarea>
            </div>
            <div className='mt-2 text-right'>
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
              <button
                className='btn btn-sm shadow-none post_reply_button'
                type='submit'
              >
                Post Reply
              </button>
            </div>
          </form>
          {/*---------------- Replies section  ----------------+*/}
        </div>
      </div>
      <div className='container'>
        {replies.length > 0 ? (
          <section>
            <div id='comment_section' className='comments'>
              {replies.map((reply, index) => {
                return (
                  <Reply
                    forceRerender={forceRerender}
                    key={index}
                    reply_data={reply}
                  />
                );
              })}
            </div>
          </section>
        ) : (
          <p
            style={{ textAlign: 'center', fontSize: '25px', color: '#000033' }}
          >
            <i>No Replies Yet</i>
          </p>
        )}
        <div className='sidenav'></div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  const viewed_tweet_id = state.display_reducer.viewed_tweet_id;
  const user_id = state.current_user_reducer.user_id;
  const profile_id = state.current_user_reducer.profile_id;
  const username = state.current_user_reducer.username;
  const image_url = state.current_user_reducer.image_url;
  const defaultProfileImage = state.current_user_reducer.defaultProfileImage;
  return {
    viewed_tweet_id,
    user_id,
    profile_id,
    username,
    image_url,
    defaultProfileImage
  };
};
export default connect(mapStateToProps, null)(ViewTweet);
