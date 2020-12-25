import React from 'react';
import './navBar.css';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import axiosInstance from '../axiosApi/axiosApi';

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
  const [redirect, setRedirect] = React.useState<string | null>(null);

  if (redirect) {
    return <Redirect to={redirect} />;
  }

  return (
    <nav className='navbar sticky-top navbar-expand-md navbar-dark bg-dark'>
      <a
        className='navbar-brand d-none d-lg-inline-block'
        onClick={() => {
          setRedirect('/home');
        }}
      >
        <img
          id='raven_brand'
          src='https://i.pinimg.com/originals/53/38/22/5338222e8cb88bc99dd14cb722d8c43f.jpg'
        />
      </a>
      <div
        className='navbar-collapse collapse w-100 justify-content-center'
        id='navbar5'
      >
        <ul className='navbar-nav mx-auto'>
          <li className='nav-item'>
            <a
              className='nav-link'
              onClick={() => {
                setRedirect('/home');
              }}
            >
              Home
            </a>
          </li>
          <li className='nav-item'>
            <a
              className='nav-link'
              onClick={() => {
                setRedirect('/explore');
              }}
            >
              {' '}
              Explore
            </a>
          </li>
          <li className='nav-item'>
            <a
              className='nav-link'
              onClick={() => {
                setRedirect('/bookmarks');
              }}
            >
              Bookmarks
            </a>
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
  const handleLogout = () => {
    let refresh = localStorage.getItem('refresh_token')
    axiosInstance
      .post('api/auth/user/logout/', {
        refresh_token: refresh
      })
      .then(res => {
        console.log(res.data);
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('access_token');
        setRedirect('/');
      })
      .catch(err => {
        console.log('Error in logging out', err);
        // we still want to remove the tokens even if there is an error
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('access_token');
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
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('access_token');
        setRedirect('/');
      })
      .catch(err => {
        console.log('Error in logging out', err);
        // we still want to remove the tokens even if there is an error
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('access_token');
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
            href='#'
            id='navbarDropdown'
            role='button'
            data-toggle='dropdown'
            aria-haspopup='true'
            aria-expanded='false'
          >
            <span id='burger' className='fas fa-bars'></span>
          </a>
          <div
            id='nav_dropdown_menu'
            className='dropdown-menu dropdown-menu-right'
            aria-labelledby='navbarDropdown'
          >
            <a
              className='dropdown-item'
              onClick={e => {
                setRedirect('/profile');
              }}
            >
              Profile
            </a>
            <a
              className='dropdown-item'
              onClick={() => {
                setRedirect('/settings');
              }}
            >
              Settings
            </a>
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
    user_id: state.user_id,
    profile_id: state.profile_id,
    username: state.username,
    image_url: state.image_url,
    alias: state.alias,
    mode: state.mode
  };
};
export default connect(mapStateToProps, null)(NavBar);
