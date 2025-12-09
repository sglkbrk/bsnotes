const config = {
  development: {
    apiUrl: 'https://bsnote.buraksaglik.com/api/'
  },
  test: {
    apiUrl: 'http://localhost:5262/api/'
  },
  production: {
    apiUrl: '/api/'
  }
};

export default config[process.env.NODE_ENV || 'development'];
