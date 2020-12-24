// The front page of Raven website
// includes signin / signup options
// some blah blah and a footer
import React from 'react';
import { NavLink } from 'react-router-dom';
import './frontPage.css';

const FrontPage: React.FC = () => {
  return (
    <div id='front_page_main_div'>
      <div className='front_page_content_div'>
        <div>
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
      <div className='front_page_content_div'>
        <h2>Join our community</h2>
        <ul>
          <li>Follow your interests</li>
          <li>Hear what people are talking about</li>
          <li>Learn new things everyday</li>
        </ul>
      </div>
    </div>
  );
};
export default FrontPage;
