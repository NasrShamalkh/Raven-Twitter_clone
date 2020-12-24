import { current_user_reducer } from './reducers';
import { createStore, compose } from 'redux';

const composeEnhancers =
  (window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] as typeof compose) || compose;

const store = createStore(current_user_reducer, composeEnhancers());
export default store;
