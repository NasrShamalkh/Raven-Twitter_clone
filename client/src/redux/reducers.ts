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
