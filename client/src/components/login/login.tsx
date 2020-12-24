import React, { useState } from 'react';
import axiosInstance from '../axiosApi/axiosApi';
import './login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
    axiosInstance
      .post('/api/auth/obtain_token/', {
        username: username,
        password: password
      })
      .then(res => {
        axiosInstance.defaults.headers['Authorization'] =
          'JWT ' + res.data.access;
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        console.log('Log in success !! ');
      })
      .catch(err => {
        alert('Error in log in please try again ! ');
        throw err;
      });
  };

  return (
    <div id='container'>
      <form onSubmit={handleSubmit}>
        <h3>Log in</h3>
        <div className='form-group'>
          <label>Username: </label>
          <input
            type='text'
            className='form-control'
            placeholder='Enter Username'
            value={username}
            onChange={e => {
              setUsername(e.target.value);
            }}
          />
        </div>

        <div className='form-group'>
          <label>Password: </label>
          <input
            type='password'
            className='form-control'
            placeholder='Enter password'
            value={password}
            onChange={e => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <button type='submit' className='btn btn-dark btn-lg'>
          Sign in
        </button>
      </form>
    </div>
  );
};

export default Login;
