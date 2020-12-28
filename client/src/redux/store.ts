import { current_user_reducer, display_reducer } from './reducers';
import { USER_LOGOUT } from './types';
import { createStore, compose, combineReducers } from 'redux';

const composeEnhancers =
  (window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] as typeof compose) || compose;

const appReducer = combineReducers({
  current_user_reducer,
  display_reducer
});

// configuratino to clear store on logout
// if USER_LOGOUT action is dispatched, the state is assigned to undefined==> thus returning to initial state
const root_reducer = (state, action) => {
  if (action.type == USER_LOGOUT) {
    state = undefined;
  }
  return appReducer(state, action);
};

const store = createStore(root_reducer, composeEnhancers());
export default store;
