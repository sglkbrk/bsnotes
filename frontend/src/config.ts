const config = {
  development: {
    apiUrl: 'https://bsnote.buraksaglik.com/api/'
  },
  test: {
    apiUrl: 'https://bsnote.buraksaglik.com/api/'
  },
  production: {
    apiUrl: 'https://bsnote.buraksaglik.com/api/'
  }
};

export default config[process.env.NODE_ENV || 'development'];
