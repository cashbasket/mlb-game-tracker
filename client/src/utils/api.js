import axios from 'axios';

export default {
  // Auth API calls
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
  // Team API calls
  getAllTeams: () => {
    return axios.get('/api/teams');
  },
  getTeamInfo: teamId => {
    return axios.get(`/api/teams/${teamId}`);
  },
  // Schedule API calls
  getTeamSchedule: (teamId, startDate, endDate) => {
    return axios.get(`/api/schedule/${teamId}?start=${startDate}&end=${endDate}`);
  },
  // Game API calls
  getGameInfo: gameId => {
    return axios.get(`/api/game/${gameId}`);
  },
  addAttendance: (userId, gameId) => {
    return axios.post('/api/game/attendance', {
      userId: userId,
      gameId: gameId
    });
  },
  deleteAttendance: (id) => {
    return axios.delete(`/api/game/attendance/${id}`);
  }
};