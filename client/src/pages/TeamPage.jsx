import React from 'react';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import moment from 'moment';
import DatePicker from 'material-ui-pickers/DatePicker';
import API from '../utils/api';
import GameList from '../components/GameList';
import Game from '../components/Game';
import TeamInfo from '../components/TeamInfo';
import { withStyles } from 'material-ui/styles';
import { withUser } from '../services/withUser';
import LoadingModal from '../components/LoadingModal';
import Navbar from '../components/Navbar';

const styles = theme => ({
  upcoming: {
    marginBottom: 15
  },
  dateFilter: {
    marginBottom: 20
  },
  bold: {
    fontWeight: 700
  }
});

class TeamPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      teamId: this.props.match.params.teamId,
      startDate: new Date(),
      endDate: new Date(new Date().getFullYear(), 11, 31),
      displayedGames: [],
      teamName: '',
      teamLogo: '',
      teamVenueName: '',
      teamEstablished: '',
      teamLeague: '',
      teamDivision: '',
      teamManager: '',
      modalOpen: false
    };
  }
  componentDidMount = () => {
    this.handleTeamChange(this.props.match.params.teamId);
  };

  handleTeamChange = (id) => {
    let infoObj;
    this.setState({teamId: id, modalOpen: true}, 
      () => {
        API.getTeamInfo(this.state.teamId)
          .then((res) => {
            infoObj = { 
              teamCity: res.data.team.city,
              teamName: res.data.team.name, 
              teamLogo: res.data.team.logo,
              teamVenueName: res.data.team.venue.name,
              teamEstablished: res.data.team.established,
              teamLeague: res.data.team.league,
              teamDivision: res.data.team.division,
              teamManager: res.data.team.manager 
            };
            return API.getTeamSchedule(this.state.teamId, moment(this.state.startDate).format('YYYYMMDD'), moment(this.state.endDate).format('YYYYMMDD'));
          })
          .then((res) => {
            infoObj.displayedGames = res.data.games;
            infoObj.modalOpen = false;
            this.setState(infoObj);
          });
      });
  }

  filterGames = () => {
    this.setState({modalOpen: true});
    API.getTeamSchedule(this.state.teamId, moment(this.state.startDate).format('YYYYMMDD'), moment(this.state.endDate).format('YYYYMMDD')).then((res) => {
      this.setState({displayedGames: res.data.games, modalOpen: false});
    });
  }

  getTeamInfo = () => {
    API.getTeamInfo(this.state.teamId)
      .then((res) => {
        this.setState({ teamName: `${res.data.team.city} ${res.data.team.name}`, 
          teamLogo: res.data.team.logo,
          teamVenueName: res.data.team.venue.name,
          teamEstablished: res.data.team.established,
          teamLeague: res.data.team.league,
          teamDivision: res.data.team.division,
          teamManager: res.data.team.manager });
      });
  };

  handleStartChange = (date) => {
    this.setState({ startDate: date },
      () => this.filterGames());
  };

  handleEndChange = (date) => {
    this.setState({ endDate: date }, 
      () => this.filterGames());
  }

  render() {
    const { startDate, endDate, displayedGames, teamId, teamName } = this.state;
    const { classes, user } = this.props;
    return (
      <div>
        <Navbar handleTeamChange={this.handleTeamChange}/>
        <Grid container spacing={24}>
          <Grid item lg={3} md={4} sm={12} xs={12}>
            <Grid container justify="center">
              <Grid item xs={12}>
                <TeamInfo teamId={teamId} state={this.state} getTeamInfo={this.getTeamInfo}/>
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={9} md={8} sm={12} xs={12}>
            <Typography variant="display1" className={classes.upcoming}>{user ? 'All' : 'Upcoming'} {teamName} Games</Typography>
            <div className={classes.dateFilter}>
              <Grid container>
                <Grid item md={4} sm={6} xs={12}>
                  <Typography variant="subheading" className={classes.bold}>From:</Typography>
                  <DatePicker
                    disablePast={user ? false : true}
                    name="startDate"
                    format="MM/DD/YYYY"
                    value={startDate}
                    onChange={this.handleStartChange}
                  />
                </Grid>
                <Grid item md={8} sm={6} xs={12}>
                  <Typography variant="subheading" className={classes.bold}>To:</Typography>
                  <DatePicker
                    disablePast={true}
                    name="endDate"
                    format="MM/DD/YYYY"
                    value={endDate}
                    onChange={this.handleEndChange}
                  />
                </Grid>
              </Grid>
            </div>
            <Grid item md={12}>
              {this.state.displayedGames.length ? ( <Typography className={classes.bold} variant="subheading">{this.state.displayedGames.length} games found.</Typography>)
                :
                (<Typography variant="subheading" className={classes.bold}>
                    There are no upcoming games in this date range.
                </Typography>)}
              <GameList>
                { this.state.displayedGames.map(game => (
                  <Game key={game.id} details={game} handleTeamChange={this.handleTeamChange} teamId={this.state.teamId} />
                ))}
              </GameList>
            </Grid>
          </Grid>
        </Grid>
        <LoadingModal open={this.state.modalOpen} />
      </div>
    );
  }
}

export default withUser(withStyles(styles)(TeamPage));