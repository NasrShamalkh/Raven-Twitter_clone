import * as actionTypes from './types';

export const setCurrentUser = newUser => {
  return {
    type: actionTypes.SET_CURRENT_USER,
    payload: {
      data: newUser
    }
  };
};
