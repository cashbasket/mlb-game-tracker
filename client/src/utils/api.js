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
  deleteAttendance: (gameId) => {
    return axios.delete(`/api/game/attendance/${gameId}`);
  },
  // Post API calls
  getPosts: (gameId) => {
    return axios.get(`/api/game/posts/${gameId}`);
  },
  createPost: (userId, gameId, postText) => {
    return axios.post('/api/game/posts', {
      userId: userId,
      gameId: gameId,
      postText: postText
    });
  },
  deletePost: (postId) => {
    return axios.delete(`/api/game/posts/${postId}`);
  },
  //Dashboard API calls
  getUser: (username) => {
    return axios.get(`/api/dashboard/user/${username}`);
  },
  getGamesAttended: (userId) => {
    return axios.get(`/api/dashboard/gamesattended/${userId}`);
  },
  getTotalPosts: (userId) => {
    return axios.get(`/api/dashboard/postscount/${userId}`);
  },
  getTotalBallparks: (userId) => {
    return axios.get(`/api/dashboard/ballparkcount/${userId}`);
  },
  getWins: (userId) => {
    return axios.get(`/api/dashboard/wins/${userId}`);
  },
  getLosses: (userId) => {
    return axios.get(`/api/dashboard/losses/${userId}`);
  },
  getLastGame: (userId) => {
    return axios.get(`/api/dashboard/last/${userId}`);
  },
  getUpcomingGames: (userId) => {
    return axios.get(`/api/dashboard/upcoming/${userId}`);
  },
  getRecentPosts: (userId) => {
    return axios.get(`/api/dashboard/recentposts/${userId}`);
  }
};