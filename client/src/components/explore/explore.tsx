import React from 'react';
import './explore.css';
import NavBar from '../navBar/navbar';

const Explore: React.FC = () => {
  return (
    <div>
      <NavBar />
      <div>
        <button
          type='button'
          className='btn btn-primary'
          data-toggle='modal'
          data-target='#left_modal'
        >
          View Tweet
        </button>
        <div
          className='modal left fade'
          id='left_modal'
          role='dialog'
          aria-labelledby='left_modal'
        >
          <div className='modal-dialog' role='document'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>
                  <textarea
                    style={{
                      width: '300px',
                      resize: 'none',
                      border: '1px solid grey',
                      borderRadius: '10px'
                    }}
                    className='form-control'
                    placeholder='Add Reply'
                    aria-label='Search'
                  ></textarea>
                </h5>
                <button
                  type='button'
                  className='close'
                  data-dismiss='modal'
                  aria-label='Close'
                >
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>

              <div className='modal-body'>Tweet Replies</div>

              <div className='modal-footer modal-footer-fixed'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  data-dismiss='modal'
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
