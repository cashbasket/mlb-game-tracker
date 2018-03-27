import axios from 'axios';

export default {
  authenticate: function() {
    return axios.get('/api/authenticate', {
      withCredentials: true
    });
  },
  login: function(loginData) {
    return axios.post('/api/login', loginData);
  },
  register: function(userData) {
    return axios.post('/api/register', userData);
  },
  logout: function() {
    return axios.post('/api/logout', {
      withCredentials: true
    });
  },
  getAllTeams: () => {
    return axios.get('/api/teams');
  }
};