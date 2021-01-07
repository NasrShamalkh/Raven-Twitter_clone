import React from 'react';
import { hot } from 'react-hot-loader';
import { Switch, Route, Redirect } from 'react-router-dom';
import { HashRouter as Router } from 'react-router-dom';
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
import PrivateRoute from './privateroute';
import ViewTweet from './viewTweet/viewTweet';
import Page_404 from './page_404/page_404';

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
    <Router basename='/static'>
      <Switch>
        <Route component={FrontPage} exact path='/' />
        <Route component={Login} path='/login' />
        <Route component={Signup} path='/signup' />
        <PrivateRoute exact component={Home} path='/home' />
        <PrivateRoute exact component={BookMarks} path='/bookmarks' />
        <PrivateRoute exact component={Profile} path='/profile' />
        <PrivateRoute exact component={Settings} path='/settings' />
        <PrivateRoute exact component={Explore} path='/explore' />
        <PrivateRoute exact component={ViewTweet} path='/viewtweet' />
        <Route path='/404' component={Page_404} />
        <Redirect to='/404' />
      </Switch>
    </Router>
  );
};

declare let module: Record<string, unknown>;
export default hot(module)(App);
