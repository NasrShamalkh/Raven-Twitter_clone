import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import axiosInstance from './axiosApi/axiosApi';

const PrivateRoute: React.FC<{
  component: React.FC;
  path: string;
  exact: boolean;
}> = props => {
  //   const [loggedin, setLoggedin] = React.useState<boolean>(false);
  let refresh_token = localStorage.getItem('refresh_token');
  let access_token = localStorage.getItem('access_token');
  //   React.useEffect(() => {
  //     // we also need to check with the auth_app in the api
  //     if (access_token && refresh_token) {
  //       axiosInstance
  //         .get('api/auth/user/current_user/')
  //         .then(res => {
  //           setLoggedin(true);
  //         })
  //         .catch(err => {
  //           setLoggedin(false);
  //           console.log('---------------No no bueno--------------------');
  //         });
  //     }
  //   }, []);

  const condition = access_token && refresh_token ? true : false;

  return condition ? (
    <Route path={props.path} exact={props.exact} component={props.component} />
  ) : (
    <Redirect to='/login' />
  );
};
export default PrivateRoute;
