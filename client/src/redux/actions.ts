import * as actionTypes from './types';

export const setCurrentUser = newUser => {
  return {
    type: actionTypes.SET_CURRENT_USER,
    payload: {
      data: newUser
    }
  };
};

export const setDisplayedTweets = tweets_data => {
  return {
    type: actionTypes.SET_DISPLAYED_TWEETS,
    payload: {
      data: tweets_data
    }
  };
};

export const setShowProfileId = profile_id => {
  return {
    type: actionTypes.SET_SHOW_PROFILE_ID,
    payload: {
      data: profile_id
    }
  };
};
