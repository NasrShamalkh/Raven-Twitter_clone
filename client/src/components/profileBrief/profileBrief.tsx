import React from 'react';
import './profileBrief.css';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import * as actions from '../../redux/actions';
import $ from 'jquery';

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
          <h3>{props.alias ? props.alias : props.username}</h3>
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
