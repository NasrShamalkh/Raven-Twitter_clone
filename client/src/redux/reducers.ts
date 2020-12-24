import * as actionTypes from './types';

interface CurrentUserStateInterface {
  user_id: number | string;
  profile_id: number | string;
  image_url: string | null;
  username: string;
  alias: string | null;
  email: string;
  mode: string;
}
const current_user_initial_state: CurrentUserStateInterface = {
  user_id: '',
  profile_id: '',
  image_url: '',
  username: '',
  alias: '',
  email: '',
  mode: ''
};

export const current_user_reducer = (
  state = current_user_initial_state,
  action
) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_USER:
      return action.payload.data;
    default:
      return state;
  }
};
