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

const styles = theme => ({
  avatar: {
    width: 160,
    height: 160,
    border: `1px solid ${theme.palette.primary.main}`
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
        console.log('User stuff:');
        console.log(res.data.userInfo);
        userId = res.data.userInfo.id;
        profileInfo.userInfo = res.data.userInfo;
        return API.getUpcomingForProfile(userId);
      }).then((res) => {
        console.log(res.data);
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

  getProfileData = (username) => {
    
  }

  render() {
    console.log(this.state);
    const { pastGames, upcomingGames, userInfo } = this.state;
    const { classes, user } = this.props;    
    return (
      <div>
        <Row id="page-content" className="hidden">
          <Col md={12}>
            <Row className={classes.userInfo}>
              <Col md={2}>
                <Avatar
                  alt={userInfo.username}
                  src={userInfo.gravatar}
                  className={`img-fluid ${classes.avatar}`}/>
              </Col>
              <Col md={10}>
                <Typography className={classes.username} variant="display2">{userInfo.username}</Typography>
                <Typography variant="subheading">{userInfo.description ? userInfo.description : ''}</Typography>
              </Col>
            </Row>
            <Typography variant="headline">
             Upcoming Games
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
           Past Games:
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