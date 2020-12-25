import React from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as actions from '../redux/actions';
import axiosInstance from './axiosApi/axiosApi';
import './App.css';
import FrontPage from './frontPage/frontPage';
import Login from './login/login';
import Signup from './signup/signup';
import Home from './home/home';
import BookMarks from './bookmarks/bookmarks';
import Explore from './explore/explore';
import Profile from './profile/profile';
import Settings from './settings/settings';

const App: React.FC = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    if (localStorage.getItem('access_token')) {
      axiosInstance.get('api/auth/user/current_user/').then(res => {
        dispatch(actions.setCurrentUser(res.data));
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
        <Route component={BookMarks} path='/bookmarks' />
        <Route component={Profile} path='/profile' />
        <Route component={Settings} path='/settings' />
        <Route component={Explore} path='/explore' />
      </Switch>
    </Router>
  );
};

declare let module: Record<string, unknown>;
export default hot(module)(App);
