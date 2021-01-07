import React from 'react';
import NavBar from '../navBar/navbar';
import './page_404.css';
const Page_404: React.FC = () => {
  return (
    <div>
      <NavBar />
      <div id='page_404_div'>
        <h2 id='page_404_h2'>Raven</h2>
        <div id='page_404_div_02'>
          <h1 className='page_404_h1'>
            <b>4 </b>
          </h1>
          <img src='https://res.cloudinary.com/nasr-cloudinary/image/upload/v1610050370/Raven%20App/0d648f1f545ad913c20d7d6447d43449-raven-circle-icon-by-vexels_uzz7hr.png' />{' '}
          <h1 className='page_404_h1'>
            <b>4</b>
          </h1>
        </div>
        <h2 id='page_404_h2'>PAGE NOT FOUND</h2>
      </div>
    </div>
  );
};
export default Page_404;
