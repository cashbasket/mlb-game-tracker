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
  // Team Record API calls
  getTeamRecord: (season, team) => {
    return axios.get(`/api/msf/record/${season}/${team}`);
  },
  // Game API calls
  getGameInfo: gameId => {
    return axios.get(`/api/game/${gameId}`);
  },
  // Game API calls
  getGamesToUpdate: () => {
    return axios.get('/api/msf/update');
  },
  updateGameInfo: (gameId, data) => {
    return axios.put(`/api/admin/game/${gameId}`, data);
  },
  // Team Record API calls
  getBoxScore: (gameId, season) => {
    return axios.get(`/api/msf/game/${season}/${gameId}`);
  },
  addAttendance: (userId, gameId) => {
    return axios.post('/api/game/attendance', {
      userId: userId,
      gameId: gameId
    });
  },
  getAttendees: (gameId) => {
    return axios.get(`/api/game/attendance/${gameId}`);
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
  updatePost: (postId, postText) => {
    return axios.put(`/api/game/posts/${postId}`, {
      postText: postText
    });
  },
  deletePost: (postId) => {
    return axios.delete(`/api/game/posts/${postId}`);
  },
  // Comment API calls
  getComments: (postId) => {
    return axios.get(`/api/game/posts/${postId}/comments`);
  },
  createComment: (userId, postId, commentText) => {
    return axios.post('/api/game/posts/comments', {
      userId: userId,
      postId: postId,
      commentText: commentText
    });
  },
  updateComment: (commentId, commentText) => {
    return axios.put(`/api/game/posts/comments/${commentId}`, {
      commentText: commentText
    });
  },
  deleteComment: (commentId) => {
    return axios.delete(`/api/game/posts/comments/${commentId}`);
  },
  //Dashboard API
  getGamesAttended: () => {
    return axios.get('/api/dashboard/gamesattended');
  },
  getTotalPosts: () => {
    return axios.get('/api/dashboard/postscount');
  },
  getTotalBallparks: () => {
    return axios.get('/api/dashboard/ballparkcount');
  },
  getWins: () => {
    return axios.get('/api/dashboard/wins');
  },
  getLosses: () => {
    return axios.get('/api/dashboard/losses');
  },
  getLastGame: () => {
    return axios.get('/api/dashboard/last');
  },
  getUpcomingGames: () => {
    return axios.get('/api/dashboard/upcoming');
  },
  getRecentPosts: () => {
    return axios.get('/api/dashboard/recentposts');
  },
  //profile API
  getUser: (username) => {
    return axios.get(`/api/profile/${username}`);
  },
  getUpcomingForProfile: (userId) => {
    return axios.get(`/api/profile/upcoming/${userId}`);
  },
  getPastGames: (userId) => {
    return axios.get(`/api/profile/past/${userId}`);
  },
  //account API
  getAccountInfo: () => {
    return axios.get('/api/auth/account');
  },
  updateAccountInfo: (data) => {
    return axios.put('/api/auth/account', data);
  },
  //pasword reset API
  forgotPassword: (email) => {
    return axios.put('/api/auth/forgot', {
      email: email
    });
  },
  checkToken: (token) => {
    return axios.get(`/api/auth/checkToken/${token}`);
  },
  resetPassword: (token, password) => {
    return axios.put('/api/auth/reset', {
      token: token,
      password: password
    });
  }
};