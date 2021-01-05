import React from 'react';
import './profileBrief.css';
import { useDispatch } from 'react-redux';
import * as actions from '../../redux/actions';
import { Link } from 'react-router-dom';

interface IRelated {
  id: string | number;
  username: string;
}
export interface IProfileBrief {
  id: string | number;
  username: string;
  user_id: number | string;
  number_of_followers: number | string;
  image_url: string;
  related: Array<IRelated>;
  alias: string | null;
}
const ProfileBrief: React.FC<IProfileBrief> = (props: IProfileBrief) => {
  const get_related = () => {
    switch (props.related.length) {
      case 1:
        return <span>{props.related[0].username}</span>;
      case 2:
        return (
          <span>
            {props.related[0].username} & {props.related[1].username}
          </span>
        );
      default:
        <span>
          {props.related[0].username} & {props.related[1].username}+
          {props.related.length - 2}...more
        </span>;
    }
  };
  return (
    <li className='list-group-item d-flex list-group-item-action profile_pointer'>
      <div id='profile_brief_image_div'>
        <img
          id='profile_brief_image'
          src={
            props.image_url
              ? props.image_url
              : 'https://res.cloudinary.com/nasr-cloudinary/image/upload/v1608924149/Raven%20App/istockphoto-93394538-612x612_gui0vc.jpg'
          }
        />
      </div>
      <div id='profile_brief_content_div'>
        <div
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <span className='fas fa-at'></span>
          <h3>
            {props.username}
            {props.alias ? <small>({props.alias})</small> : ''}
          </h3>
        </div>
        <small>
          <span className='badge badge-primary badge-pill'>
            {props.number_of_followers}
          </span>{' '}
          Followers
        </small>
        <br />
        {props.related.length > 0 ? (
          <small>Followed By: {get_related()}</small>
        ) : (
          <small>Not followed by anyone you're following</small>
        )}
      </div>
    </li>
  );
};
export default ProfileBrief;

export const S_ProfileBrief: React.FC<IProfileBrief> = (
  props: IProfileBrief
) => {
  const dispatch = useDispatch();

  const get_related = () => {
    switch (props.related.length) {
      case 1:
        return <span>{props.related[0].username}</span>;
      case 2:
        return (
          <span>
            {props.related[0].username} & {props.related[1].username}
          </span>
        );
      default:
        <span>
          {props.related[0].username} & {props.related[1].username}+
          {props.related.length - 2}...more
        </span>;
    }
  };
  return (
    <Link
      onClick={() => {
        dispatch(actions.setShowProfileId(props.user_id));
      }}
      to='/profile'
      id='S_profile_div'
      className='list-group-item d-flex list-group-item-action S_profile_pointer'
    >
      <div id='S_profile_brief_image_div'>
        <img
          id='S_profile_brief_image'
          src={
            props.image_url
              ? props.image_url
              : 'https://res.cloudinary.com/nasr-cloudinary/image/upload/v1608924149/Raven%20App/istockphoto-93394538-612x612_gui0vc.jpg'
          }
        />
      </div>
      <div id='S_profile_brief_content_div'>
        <div
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <span
            style={{
              marginRight: '3px'
            }}
            className='fas fa-at'
          ></span>{' '}
          <h3>
            <i>
              {props.username}
              {props.alias ? <small>({props.alias})</small> : ''}
            </i>
          </h3>
        </div>
        <small>
          <span className='badge badge-primary badge-pill'>
            {props.number_of_followers}
          </span>{' '}
          Followers
        </small>
        <br />
        {props.related.length > 0 ? (
          <small
            className='followed_by_small'
            style={{
              fontSize: '10px'
            }}
          >
            Followed By: {get_related()}
          </small>
        ) : (
          <small
            style={{
              fontSize: '10px'
            }}
            className='followed_by_small'
          >
            Not followed by anyone you're following
          </small>
        )}
      </div>
    </Link>
  );
};
