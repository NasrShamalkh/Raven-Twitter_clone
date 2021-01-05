import React from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import './frontPage.css';

const FrontPage: React.FC = () => {
  const [redirect, setRedirect] = React.useState<string | null>(
    localStorage.getItem('access_token') ? '/home' : null
  );

  if (redirect) {
    return <Redirect to={redirect} />;
  }
  return (
    <div
      style={{
        color: 'white'
      }}
      id='front_page_main_div'
    >
      <div
        style={{
          color: 'white'
        }}
        className='front_page_content_div'
      >
        <div
          style={{
            color: 'white'
          }}
        >
          <h3>Keep yourself up to speed</h3>
          <h4>Join Ravn !</h4>
          <NavLink to='/login'>
            <button className='btn btn-primary btn-lg' type='button'>
              {' '}
              Login{' '}
            </button>
          </NavLink>{' '}
          <br />
          <NavLink to='/signup'>
            <button className='btn btn-primary btn-lg' type='button'>
              {' '}
              Signup{' '}
            </button>
          </NavLink>
        </div>
      </div>
      <img
        id='front_image'
        src='https://res.cloudinary.com/nasr-cloudinary/image/upload/v1609873260/Raven%20App/29999ee5c8db845f7ef7f45dfac264b6_iy6lss.jpg'
      />
      <div className='front_page_content_div'>
        <h2>Join our community</h2>
        <ul>
          <li>
            <i className='fa fa-flag' aria-hidden='true'></i> &nbsp; Follow your
            interests
          </li>
          <li>
            <i className='fa fa-flag' aria-hidden='true'></i> &nbsp; Hear what
            people are talking about
          </li>
          <li>
            <i className='fa fa-flag' aria-hidden='true'></i> &nbsp; Learn new things
            everyday
          </li>
        </ul>
      </div>
    </div>
  );
};
export default FrontPage;
