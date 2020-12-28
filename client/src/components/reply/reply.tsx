import './reply.css';
import React from 'react';
import { getDate } from '../tweet/tweet';
import { connect } from 'react-redux';
import axiosInstance from '../axiosApi/axiosApi';

export interface IReply {
  reply_id: string | number;
  tweet: string | number;
  user: string | number;
  username: string;
  alias: string | null;
  image_url: string | null;
  content: string | null;
  media: boolean;
  media_url: null | string;
  number_of_likes: string | number;
  liked: boolean;
  timestamp: string | Date;
}
interface Props {
  reply_data: IReply;
  defaultProfileImage: string;
  forceRerender?: Function;
}

const Reply: React.FC<Props> = (props: Props) => {
  const handleReplyLike = () => {
    axiosInstance
      .put(
        `api/tweets/replies/liked_replies_list/${props.reply_data.reply_id}/`
      )
      .then(res => {
        if (props.forceRerender) {
          props.forceRerender();
        }
      })
      .catch(err => console.error('Error in liking rely', err));
  };
  return (
    <article className='comment'>
      <a className='comment-img'>
        <img
          src={
            props.reply_data.image_url
              ? props.reply_data.image_url
              : props.defaultProfileImage
          }
          alt='...'
          width='60'
        />
      </a>
      <div className='comment-body'>
        {props.reply_data.content ? (
          <div className='text'>{props.reply_data.content}</div>
        ) : (
          ''
        )}
        <div>
          {props.reply_data.media ? (
            <img
              id='comment_media'
              src={props.reply_data.media_url}
              alt='...'
            />
          ) : (
            ''
          )}
        </div>
        <p className='attribution'>
          <span>
            by{' '}
            <a>
              {props.reply_data.alias
                ? props.reply_data.alias
                : props.reply_data.username}
            </a>{' '}
            at{' '}
            {`${new Date(props.reply_data.timestamp).getHours()}: ${new Date(
              props.reply_data.timestamp
            ).getMinutes()}`}
            , {getDate(props.reply_data.timestamp)}
          </span>
          <span id='reply-number_of_likes'>
            {props.reply_data.number_of_likes} Likes
          </span>
        </p>
        <br />
        <div onClick={handleReplyLike} id='reply_like_dev'>
          <div id='reply_like_button'>
            {props.reply_data.liked ? (
              <i style={{ color: 'red' }} className='fa fa-heart'></i>
            ) : (
              <i className='far fa-heart'></i>
            )}
            <span className='ml-1'>Like</span>
          </div>
        </div>
      </div>
    </article>
  );
};

const mapStateToProps = state => {
  const defaultProfileImage = state.current_user_reducer.defaultProfileImage;
  return { defaultProfileImage };
};

export default connect(mapStateToProps, null)(Reply);
