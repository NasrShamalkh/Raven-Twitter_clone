import React, { FormEvent } from 'react';
import { Redirect } from 'react-router-dom';
import axios, { AxiosError, AxiosResponse } from 'axios';
import axiosInstance from '../axiosApi/axiosApi';
import './signup.css';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';
interface Props {
  set_current_user: Function;
}

const Signup: React.FC<Props> = (props: Props) => {
  const [username, setUsername] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [date, setDate] = React.useState('');
  const [password, setPassword] = React.useState<string>('');
  const [password2, setPassword2] = React.useState<string>('');
  const [redirect, setRedirect] = React.useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== password2) {
      alert('Passwords did not match');
      return;
    }
    await axios
      .post('api/auth/user/register/', {
        username: username,
        email: email,
        password: password,
        password2: password2,
        profile: {
          date_of_birth: date
        }
      })
      .then(async (res: AxiosResponse) => {
        axiosInstance.defaults.headers['Authorization'] =
          'JWT ' + res.data.access;
        localStorage.setItem('access_token', res.data.tokens.access);
        localStorage.setItem('refresh_token', res.data.tokens.refresh);
        setRedirect('/home');
        await axiosInstance
          .get('api/auth/user/current_user/')
          .then((res: AxiosResponse) => {
            props.set_current_user(res.data);
          })
          .catch((err: AxiosResponse) => {
            console.error('Error in getting current user', err);
          });
      })
      .catch((err: AxiosError) => {
        if (err.response.status === 409 || err.response.status === 409) {
          alert(err.response.data.message);
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
      id='signup_container'
    >
      <form id='signup_form' onSubmit={handleSubmit}>
        <h3>Register</h3>

        <div className='form-group'>
          <label>Username: </label>
          <input
            type='text'
            className='form-control'
            placeholder='Enter username'
            value={username}
            required
            onChange={e => {
              setUsername(e.target.value);
            }}
          />
        </div>

        <div className='form-group'>
          <label>Email: </label>
          <input
            type='email'
            className='form-control'
            placeholder='Enter email'
            value={email}
            onChange={e => {
              setEmail(e.target.value);
            }}
            required
          />
        </div>

        <div className='form-group'>
          <label>Date of Birth</label>
          <input
            type='date'
            className='form-control'
            placeholder='Enter date of Birth'
            value={date}
            onChange={e => {
              setDate(e.target.value);
            }}
            min='1910-01-01'
            max='2020-01-01'
            required
          />
        </div>

        <div className='form-group'>
          <label>Password</label>
          <input
            type='password'
            className='form-control'
            placeholder='Enter password'
            value={password}
            onChange={e => {
              setPassword(e.target.value);
            }}
            pattern='(?=.*\d)(?=.*[a-z]).{8,30}$'
            title='Must contain at least one number and one lowercase letter, and (8-30) characters'
            required
          />
        </div>

        <div className='form-group'>
          <label>Re-enter password: </label>
          <input
            type='password'
            className='form-control'
            placeholder='Re-enter password'
            value={password2}
            onChange={e => setPassword2(e.target.value)}
            required
          />
        </div>

        <button type='submit' className='btn btn-dark btn-lg'>
          Register
        </button>
        <p className='text-right'>
          Already registered ?{' '}
          <span
            className='redirect_link'
            onClick={() => {
              setRedirect('/login');
            }}
          >
            Login
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

export default connect(null, mapDispatchToProps)(Signup);
