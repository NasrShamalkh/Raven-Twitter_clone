import { current_user_reducer, display_reducer } from './reducers';
import { createStore, compose, combineReducers } from 'redux';

const composeEnhancers =
  (window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] as typeof compose) || compose;

const root_reducer = combineReducers({
  current_user_reducer,
  display_reducer
});
const store = createStore(root_reducer, composeEnhancers());
export default store;
