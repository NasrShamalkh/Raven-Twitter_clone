import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const config: AxiosRequestConfig = {
  timeout: 5000,
  headers: {
    Authorization: 'JWT ' + localStorage.getItem('access_token'),
    'Content-Type': 'application/json',
    accept: 'application/json'
  }
};

const axiosInstance: AxiosInstance = axios.create(config);
axiosInstance.defaults.xsrfCookieName = 'csrftoken';
axiosInstance.defaults.xsrfHeaderName = 'X-CSRFToken';
axiosInstance.interceptors.response.use(
  // if the auth error is 401 which porpably means that the token has timed out
  // then we use the refresh token to get a new access token
  // and this is done for each request ==> anytime inside our app
  response => response,
  error => {
    const originalRequest: AxiosRequestConfig = error.config;

    if (
      error.response.status === 401 &&
      error.response.statusText === 'Unauthorized'
    ) {
      const refresh_token = localStorage.getItem('refresh_token');

      return axiosInstance
        .post('/api/auth/refresh_token/', { refresh: refresh_token })
        .then(response => {
          localStorage.setItem('access_token', response.data.access);
          localStorage.setItem('refresh_token', response.data.refresh);

          axiosInstance.defaults.headers['Authorization'] =
            'JWT ' + response.data.access;
          originalRequest.headers['Authorization'] =
            'JWT ' + response.data.access;

          return axiosInstance(originalRequest);
        })
        .catch(err => {
          console.log(err);
        });
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
