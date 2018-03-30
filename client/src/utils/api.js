import axios from 'axios';

export default {
  authenticate: function() {
    return axios.get('/api/auth/authenticate', {
      withCredentials: true
    });
  },
  login: function(loginData) {
    return axios.post('/api/auth/login', loginData);
  },
  register: function(userData) {
    return axios.post('/api/auth/register', userData);
  },
  logout: function() {
    return axios.post('/api/auth/logout', {
      withCredentials: true
    });
  },
  getAllTeams: () => {
    return axios.get('/api/teams');
  }
};