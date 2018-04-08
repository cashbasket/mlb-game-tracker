const axios = require('axios');

// Defining methods for the teamController
module.exports = {
  
  divRecord: function(req, res) {
    axios({
      method: 'get',
      url: `/${req.params.season}/division_team_standings.json?teamstats=W,L,GB&team=${req.params.team}`,
      baseURL: 'https://api.mysportsfeeds.com/v1.2/pull/mlb',
      auth: {
        username: process.env.MSF_USERNAME,
        password: process.env.MSF_PW
      }
    })
      .then(dbTeam => res.json(dbTeam.data.divisionteamstandings.division.filter(division => division.teamentry)[0].teamentry))
      .catch(err => res.status(400).json(err));
  },
  
  game: function(req, res) {
    axios({
      method: 'get',
      url: `/${req.params.season}/game_boxscore.json?gameid=${req.params.id}&teamstats=R,H,E&playerstats=none`,
      baseURL: 'https://api.mysportsfeeds.com/v1.2/pull/mlb',
      auth: {
        username: process.env.MSF_USERNAME,
        password: process.env.MSF_PW
      }
    })
      .then(dbGame => res.json(dbGame.data))
      .catch(err => res.status(400).json(err));
  },

  update: function(req, res) {
    axios({
      method: 'get',
      url: '/current/team_gamelogs.json?team=lad,cle,hou,was,bos,ari,chc,nyy,col,mil,min,stl,tb,kc,laa,tex,sea,mia,tor,bal,pit,oak,atl,sd,nym,cin,cws,phi,det,sf&teamstats=RF,RA&date=since-2-weeks-ago',
      baseURL: 'https://api.mysportsfeeds.com/v1.2/pull/mlb',
      auth: {
        username: process.env.MSF_USERNAME,
        password: process.env.MSF_PW
      }
    })
      .then(dbGame => res.json(dbGame.data.teamgamelogs))
      .catch(err => res.status(400).json(err));
  }
};
