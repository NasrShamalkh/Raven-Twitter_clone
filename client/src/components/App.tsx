import React from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import FrontPage from './frontPage/frontPage';
import Login from './login/login';
import Signup from './signup/signup';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route component={FrontPage} exact path='/' />
        <Route component={Login} path='/login' />
        <Route component={Signup} path='/signup' />
      </Switch>
    </Router>
  );
};

declare let module: Record<string, unknown>;

export default hot(module)(App);
