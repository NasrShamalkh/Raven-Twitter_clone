import React from 'react';
import './navBar.css';
import { connect, useDispatch } from 'react-redux';
import { NavLink, Redirect } from 'react-router-dom';
import axiosInstance from '../axiosApi/axiosApi';
import * as actions from '../../redux/actions';

interface CurrentUserInterface {
  user_id: string | number;
  profile_id: string | number;
  username: string;
  image_url: string | null;
  alias: string | null;
  mode: string;
  DropDown?: React.FC;
}
const NavBar: React.FC<CurrentUserInterface> = (
  props: CurrentUserInterface
) => {
  return (
    <nav className='navbar sticky-top navbar-expand-md navbar-dark bg-dark'>
      <NavLink to='/home' className='navbar-brand d-none d-lg-inline-block'>
        <img
          id='raven_brand'
          src='http://res.cloudinary.com/nasr-cloudinary/image/upload/v1608924243/Raven%20App/5338222e8cb88bc99dd14cb722d8c43f_r4qs7p.jpg'
        />
      </NavLink>
      <div
        className='navbar-collapse collapse w-100 justify-content-center'
        id='navbar5'
      >
        <ul className='navbar-nav mx-auto'>
          <li className='nav-item'>
            <NavLink to='/home' className='nav-link'>
              Home
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to='/explore' className='nav-link'>
              {' '}
              Explore
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to='/bookmarks' className='nav-link'>
              Bookmarks
            </NavLink>
          </li>
        </ul>
      </div>
      {/* Add dropdown component here */}
      <DropDown user={{ ...props }} />
    </nav>
  );
};

const DropDown = props => {
  const [redirect, setRedirect] = React.useState<string | null>(null);
  let user = props.user;
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(actions.userLogout());
    let refresh = localStorage.getItem('refresh_token');
    axiosInstance
      .post('api/auth/user/logout/', {
        refresh_token: refresh
      })
      .then(res => {
        console.log(res.data);
        localStorage.clear();
        setRedirect('/');
      })
      .catch(err => {
        console.error('Error in logging out', err);
        // we still want to remove the tokens even if there is an error
        localStorage.clear();
        setRedirect('/');
      });
  };

  const handleLogoutFromALl = () => {
    axiosInstance
      .post('api/auth/user/logout_all/', {
        refresh_token: localStorage.getItem('refresh_token')
      })
      .then(res => {
        console.log(res.data);
        localStorage.clear();
        setRedirect('/');
      })
      .catch(err => {
        console.error('Error in logging out', err);
        // we still want to remove the tokens even if there is an error
        localStorage.clear();
        setRedirect('/');
      });
  };

  if (redirect) {
    return <Redirect to={redirect} />;
  }
  return (
    <div className='navbar-collapse collapse order-3 dual-collapse2'>
      <ul className='navbar-nav ml-auto'>
        <li className='nav-item dropdown'>
          <a
            className='nav-link dropdown-toggle'
            id='navbarDropdown'
            role='button'
            data-toggle='dropdown'
            aria-haspopup='true'
            aria-expanded='false'
          >
            <img
              src={
                user.image_url
                  ? user.image_url
                  : 'http://res.cloudinary.com/nasr-cloudinary/image/upload/v1608924149/Raven%20App/istockphoto-93394538-612x612_gui0vc.jpg'
              }
              id='profile_image'
            />
            <span>{user.alias ? user.alias : user.username}</span>
          </a>
          <div
            id='nav_dropdown_menu'
            className='dropdown-menu dropdown-menu-right'
            aria-labelledby='navbarDropdown'
          >
            <NavLink
              onClick={() => {
                dispatch(actions.setShowProfileId(props.user.user_id));
              }}
              to='/profile'
              className='dropdown-item'
            >
              Profile
            </NavLink>
            <NavLink to='/settings' className='dropdown-item'>
              Settings
            </NavLink>
            <div className='dropdown-divider'></div>
            <a className='dropdown-item log_out_text' onClick={handleLogout}>
              <i>Log out</i>
            </a>
            <a
              className='dropdown-item log_out_from_all_text'
              onClick={handleLogoutFromALl}
            >
              <i>Log out from all devices</i>
            </a>
          </div>
        </li>
      </ul>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user_id: state.current_user_reducer.user_id,
    profile_id: state.current_user_reducer.profile_id,
    username: state.current_user_reducer.username,
    image_url: state.current_user_reducer.image_url,
    alias: state.current_user_reducer.alias,
    mode: state.current_user_reducer.mode
  };
};
export default connect(mapStateToProps, null)(NavBar);
