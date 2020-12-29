import React from 'react';
import './explore.css';
import NavBar from '../navBar/navbar';
import axiosInstance from '../axiosApi/axiosApi';

const Explore: React.FC = () => {
  const [data, setData] = React.useState([])
  const makeRequest = () => {
    axiosInstance
    .get('api/tweets/get_top/')
    .then(res => setData(res.data))
    .catch(err => console.log('Error', err))
  }
  if(data) {
    console.log(data)
  }
  return (
    <div>
      <NavBar />
      <h1>Explore</h1>
      <button onClick={makeRequest}>make requset</button>
    </div>
  );
};

export default Explore;
