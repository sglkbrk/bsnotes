const isDev = process.env.NODE_ENV === 'development';
const defaultApi = isDev ? 'http://localhost:5002/api/' : 'https://bsnote.buraksaglik.com/api/';
const apiUrl = process.env.REACT_APP_API_URL || defaultApi;

const config = {
  development: {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5002/api/'
  },
  test: {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5002/api/'
  },
  production: {
    apiUrl
  }
};

export default config[process.env.NODE_ENV || 'development'];

