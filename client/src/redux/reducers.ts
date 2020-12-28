import * as actionTypes from './types';

interface CurrentUserStateInterface {
  user_id: number | string;
  profile_id: number | string;
  image_url: string | null;
  username: string;
  alias: string | null;
  email: string;
  mode: string;
  defaultProfileImage: string;
}
const current_user_initial_state: CurrentUserStateInterface = {
  user_id: '',
  profile_id: '',
  image_url: '',
  username: '',
  alias: '',
  email: '',
  mode: '',
  defaultProfileImage:
    'https://res.cloudinary.com/nasr-cloudinary/image/upload/v1608924149/Raven%20App/istockphoto-93394538-612x612_gui0vc.jpg'
};

export const current_user_reducer = (
  state = current_user_initial_state,
  action
) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_USER:
      let defaultProfileImage =
        'https://res.cloudinary.com/nasr-cloudinary/image/upload/v1608924149/Raven%20App/istockphoto-93394538-612x612_gui0vc.jpg';
      let data = action.payload.data;
      data.defaultProfileImage = defaultProfileImage;
      return data;
    default:
      return state;
  }
};

interface IDisplay {
  tweets_data: Array<object>;
  show_profile_user_id: number | string;
  viewed_tweet_id: string | number;
}

const init_dispaly: IDisplay = {
  tweets_data: [],
  show_profile_user_id: localStorage.getItem('profile_user_id') || '',
  viewed_tweet_id: ''
};

export const display_reducer = (state: IDisplay = init_dispaly, action) => {
  switch (action.type) {
    case actionTypes.SET_DISPLAYED_TWEETS:
      return {
        tweets_data: [...action.payload.data]
      };
    case actionTypes.SET_SHOW_PROFILE_ID:
      localStorage.setItem('profile_user_id', action.payload.data);
      return {
        ...state,
        show_profile_user_id: action.payload.data
      };
    case actionTypes.SET_VIEWED_TWEET_ID:
        localStorage.setItem('viewed_tweet_id', action.payload.data);
      return {
        ...state,
        viewed_tweet_id: action.payload.data
      };
    default:
      return state;
  }
};
