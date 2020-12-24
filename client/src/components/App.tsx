import React from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import axiosInstance from './axiosApi/axiosApi';
import './App.css';
import FrontPage from './frontPage/frontPage';
import Login from './login/login';
import Signup from './signup/signup';
import Home from './home/home';
interface Props {
  set_current_user: Function;
}

const App: React.FC<Props> = (props: Props) => {
  React.useEffect(() => {
    if (localStorage.getItem('access_token')) {
      axiosInstance.get('api/auth/user/current_user/').then(res => {
        props.set_current_user(res.data);
      });
    }
  }, []);
  return (
    <Router>
      <Switch>
        <Route component={FrontPage} exact path='/' />
        <Route component={Home} path='/home' />
        <Route component={Login} path='/login' />
        <Route component={Signup} path='/signup' />
      </Switch>
    </Router>
  );
};

declare let module: Record<string, unknown>;

const mapDispatchToProps = dispatch => {
  return {
    set_current_user: newUser => dispatch(actions.setCurrentUser(newUser))
  };
};

export default hot(module)(connect(null, mapDispatchToProps)(App));
