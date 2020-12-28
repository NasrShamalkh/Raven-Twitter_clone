import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import axios, { AxiosResponse, AxiosError } from 'axios';
import axiosInstance from '../axiosApi/axiosApi';
import './login.css';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';

interface Props {
  set_current_user: Function;
}

const Login: React.FC<Props> = (props: Props) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [redirect, setRedirect] = useState<string | null>(null);

  const handleSubmit = async event => {
    event.preventDefault();
    await axios
      .post('/api/auth/obtain_token/', {
        username: username,
        password: password
      })
      .then(async (res: AxiosResponse) => {
        axiosInstance.defaults.headers['Authorization'] =
          'JWT ' + res.data.access;
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        setRedirect('/home');
        await axiosInstance
          .get('api/auth/user/current_user/')
          .then(res => {
            props.set_current_user(res.data);
          })
          .catch((err: AxiosError) => {
            console.error('Error in getting current user', err);
          });
      })
      .catch((err: AxiosError) => {
        if (err.response.status === 401) {
          alert('Please check your Information');
        }
      });
  };

  if (redirect) {
    return <Redirect to={redirect} />;
  }

  return (
    <div
      style={{
        color: 'white'
      }}
      id='container'
    >
      <form id='login_form' onSubmit={handleSubmit}>
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
            required
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
            required
          />
        </div>
        <button type='submit' className='btn btn-dark btn-lg'>
          Sign in
        </button>
        <p className='text-right'>
          Don't have an account ?{' '}
          <span
            className='redirect_link'
            onClick={() => {
              setRedirect('/signup');
            }}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    set_current_user: newUser => dispatch(actions.setCurrentUser(newUser))
  };
};

export default connect(null, mapDispatchToProps)(Login);
