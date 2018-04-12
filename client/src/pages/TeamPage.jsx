import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { withRouter } from 'react-router-dom';
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
import Paper from 'material-ui/Paper';
import Navbar from '../components/Navbar';

const styles = theme => ({
  upcoming: {
    marginBottom: theme.spacing.unit * 2
  },
  dateFilter: {
    marginBottom: theme.spacing.unit * 2
  },
  bold: {
    fontWeight: 700
  },
  errorPaper: {
    backgroundColor: theme.palette.primary.light,
    fontSize: 24,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing.unit * 2
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
      city: '',
      name: '',
      logo: '',
      teamVenueName: '',
      established: '',
      league: '',
      division: '',
      manager: '',
      wins: '',
      losses: '',
      rank: '',
      gamesBack: '',
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
            if (res.data.team) {
              infoObj = { 
                abbr: res.data.team.abbr,
                city: res.data.team.city,
                name: res.data.team.name, 
                logo: res.data.team.logo,
                teamVenueName: res.data.team.venue.name,
                established: res.data.team.established,
                league: res.data.team.league,
                division: res.data.team.division,
                manager: res.data.team.manager 
              };
              return API.getTeamSchedule(this.state.teamId, moment(this.state.startDate).format('YYYYMMDD'), moment(this.state.endDate).format('YYYYMMDD'));
            } else {
              this.setState({modalOpen: false});
              document.getElementById('no-team').classList.remove('hidden');
              return false;
            }
          })
          .then((res) => {
            if (res.data) {
              infoObj.displayedGames = res.data.games;
              infoObj.modalOpen = false;
              this.setState(infoObj,
                () => {
                  document.getElementById('page-content').classList.remove('hidden');
                });
              return API.getTeamRecord('current', infoObj.abbr);
            } else {
              return false;
            }
          })
          .then((res) => {
            if (res.data) {
              this.setState({
                wins: res.data.stats.Wins['#text'],
                losses: res.data.stats.Losses['#text'],
                rank: res.data.rank,
                gamesBack: res.data.stats.GamesBack['#text'],
              });
            }
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
        this.setState({ name: res.data.team.name,
          abbr: res.data.team.abbr,
          city: res.data.team.city,
          logo: res.data.team.logo,
          teamVenueName: res.data.team.venue.name,
          established: res.data.team.established,
          league: res.data.team.league,
          division: res.data.team.division,
          manager: res.data.team.manager });
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
    const { startDate, endDate, displayedGames, teamId, name } = this.state;
    const { classes, user } = this.props;
    return (
      <div>
        <Navbar forceDisplay={true} handleTeamChange={this.handleTeamChange}/>
        <Row id="no-team" className="hidden">
          <Col md>
            <Paper className={classes.errorPaper}>
              Sorry, we can't find the team you're looking for!
            </Paper>
          </Col>
        </Row>
        <Row id="page-content" className="hidden">
          <Col md={3}>
            <TeamInfo data={this.state}/>
          </Col>
          <Col md={9}>
            <Typography variant="display1" className={classes.upcoming}>{user ? 'All' : 'Upcoming'} {name} Games</Typography>
            <div className={classes.dateFilter}>
              <Row>
                <Col lg={4} md={5} sm={6}>
                  <Typography variant="subheading" className={classes.bold}>From:</Typography>
                  <DatePicker
                    disablePast={user ? false : true}
                    name="startDate"
                    format="M/D/YYYY"
                    value={startDate}
                    onChange={this.handleStartChange}
                  />
                </Col>
                <Col lg={8} md={7} sm={6}>
                  <Typography variant="subheading" className={classes.bold}>To:</Typography>
                  <DatePicker
                    disablePast={user ? false : true}
                    name="endDate"
                    format="M/D/YYYY"
                    value={endDate}
                    onChange={this.handleEndChange}
                  />
                </Col>
              </Row>
            </div>          
            <Row>
              <Col md={12}>
                {displayedGames.length ? ( <Typography className={classes.bold} variant="subheading">{displayedGames.length} games found.</Typography>)
                  :
                  (<Typography variant="subheading" className={classes.bold}>
                    There are no upcoming games in this date range.
                  </Typography>)}
                <GameList>
                  { displayedGames.map(game => (
                    <Game key={game.id} details={game} handleTeamChange={this.handleTeamChange} teamId={teamId} />
                  ))}
                </GameList>
              </Col>
            </Row>
          </Col>
        </Row>
        <LoadingModal open={this.state.modalOpen} />
      </div>
    );
  }
}

export default withUser(withRouter(withStyles(styles)(TeamPage)));