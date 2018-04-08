import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { withRouter } from 'react-router-dom';
import Typography from 'material-ui/Typography';
import API from '../utils/api';
import GameList from '../components/GameList';
import Game from '../components/Game';
import { withStyles } from 'material-ui/styles';
import { withUser } from '../services/withUser';
import LoadingModal from '../components/LoadingModal';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';

const styles = theme => ({
  avatar: {
    width: 160,
    height: 160,
    margin: '0 auto 20px auto',
    border: `1px solid ${theme.palette.primary.main}`
  },
  paper: {
    padding: theme.spacing.unit * 2,
    backgroundColor: '#b0bec5',
    border: `1px solid ${theme.palette.secondary.dark}`
  },
  userInfo: {
    marginBottom: theme.spacing.unit * 3
  },
  username: {
    marginBottom: theme.spacing.unit
  }
});

class ProfilePage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: this.props.match.params.username,
      userInfo: '',
      pastGames: '',
      upcomingGames: '',
      modalOpen: true
    };
  }
  componentDidMount = () => {
    let profileInfo = {};
    let userId;
    API.getUser(this.state.username)
      .then((res) => {
        userId = res.data.userInfo.id;
        profileInfo.userInfo = res.data.userInfo;
        return API.getUpcomingForProfile(userId);
      }).then((res) => {
        profileInfo.upcomingGames = res.data.upcomingGames;
        return API.getPastGames(userId);
      }).then((res) => {
        profileInfo.pastGames = res.data.pastGames;
        profileInfo.modalOpen = false;
        this.setState(profileInfo, () => {
          document.getElementById('page-content').classList.remove('hidden');
        });
      }).catch((err) => {
        console.log(err);
      });
  };

  render() {
    const { pastGames, upcomingGames, userInfo } = this.state;
    const { classes } = this.props;    
    return (
      <div>
        <Row id="page-content" className="hidden">
          <Col md={4}>
            <Paper className={classes.paper}>
              <Avatar
                alt={userInfo.username}
                src={userInfo.gravatar}
                className={`img-fluid ${classes.avatar}`}/>
              <Typography align="center" className={classes.username} variant="display1">
                {userInfo.name ? userInfo.name : userInfo.username }
              </Typography>
              <Typography align="center" variant="subheading">{userInfo.description ? userInfo.description : ''}</Typography>
              {userInfo.team ? (
                <img src={`/img/logos/${userInfo.team.logo}`} className="img-fluid team-info-logo"/>
              ) : ''}
            </Paper>
          </Col>
          <Col md>
            <Typography variant="headline">
             Games I'm Going to
            </Typography>
            {upcomingGames.length ? (
              <GameList>
                {upcomingGames.map(game => (
                  <Game 
                    key={game.id} 
                    details={game}
                    userId={userInfo.id} />
                ))}
              </GameList>
            ) : (
              <Typography variant="subheading">
                {userInfo.username} has no upcoming games :(
              </Typography>
            )}
            <br/>
            <Typography variant="headline">
           Games I've Been To
            </Typography>
            {pastGames.length ? (
              <GameList>
                {pastGames.map(game => (
                  <Game 
                    key={game.id} 
                    details={game}
                    userId={userInfo.id} />
                ))}
              </GameList>
            ) : (
              <Typography variant="subheading">
                {userInfo.username} hasn't been to any games yet. Lame.
              </Typography>
            )}
          </Col>
        </Row>
        <LoadingModal open={this.state.modalOpen} />
      </div>
    );
  }
}

export default withUser(withRouter(withStyles(styles)(ProfilePage)));