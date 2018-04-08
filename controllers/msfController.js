const axios = require('axios');

// Defining methods for the teamController
module.exports = {
  
  divRecord: function(req, res) {
    axios({
      method: 'get',
      url: `/${req.query.season}/division_team_standings.json?teamstats=W,L,GB&team=${req.query.team}`,
      baseURL: 'https://api.mysportsfeeds.com/v1.2/pull/mlb',
      auth: {
        username: process.env.MSF_USERNAME,
        password: process.env.MSF_PW
      }
    })
      .then(dbTeam => res.json(dbTeam.data.divisionteamstandings.division.filter(division => division.teamentry)[0].teamentry))
      .catch(err => res.status(400).json(err));
  }
};
