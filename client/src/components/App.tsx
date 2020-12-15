import React from 'react';
import { hot } from 'react-hot-loader';
import './App.css';

const App = () => {
  return <h1>dev server</h1>;
};

declare let module: Record<string, unknown>;

export default hot(module)(App);
