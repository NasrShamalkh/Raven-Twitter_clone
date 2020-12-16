import React from 'react';
import { hot } from 'react-hot-loader';
import './App.css';
import Login from './login/login';

const App: React.FC = () => {
  return <Login />;
};

declare let module: Record<string, unknown>;

export default hot(module)(App);
