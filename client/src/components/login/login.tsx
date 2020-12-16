import React, { useState } from 'react';
import axiosInstance from '../axiosApi/axiosApi';

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
        console.log(res, '---------');
        axiosInstance.defaults.headers['Authorization'] =
          'JWT ' + res.data.access;
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        console.log('Log in success !! ');
      })
      .catch(err => {
        throw err;
      });
  };

  return (
    <div>
      Login
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            name='username'
            type='text'
            value={username}
            onChange={e => {
              setUsername(e.target.value);
            }}
          />
        </label>
        <label>
          Password:
          <input
            name='password'
            type='password'
            value={password}
            onChange={e => {
              setPassword(e.target.value);
            }}
          />
        </label>
        <input type='submit' value='Submit' />
      </form>
    </div>
  );
};

export default Login;
