import React, { Fragment } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { withRouter, Redirect } from 'react-router-dom';
import Typography from 'material-ui/Typography';
import API from '../utils/api';
import Paper from 'material-ui/Paper';
import GameList from '../components/GameList';
import Game from '../components/Game';
import PostList from '../components/PostList';
import Post from '../components/Post';
import Divider from 'material-ui/Divider';
import { withStyles } from 'material-ui/styles';
import { withUser } from '../services/withUser';
import LoadingModal from '../components/LoadingModal';
import { Scrollbars } from 'react-custom-scrollbars';

const styles = theme => ({
  statPaper: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    minHeight: 125,
    textAlign: 'center',
    padding: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 3
  },
  postPaper: {
    backgroundColor: '#b0bec5',
    color: theme.palette.secondary.contrastText,
    border: `1px solid ${theme.palette.primary.dark}`
  },
  postsDiv: {
    maxHeight: 500,
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  postsScrollDiv: {
    padding: theme.spacing.unit * 2
  },
  statSubhead: {
    textTransform: 'uppercase'
  },
  divider: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    color: theme.palette.primary.dark
  },
  noResults: {
    padding: theme.spacing.unit * 2,
    backgroundColor: theme.palette.primary.light,
    fontSize: 16,
    color: theme.palette.secondary.contrastText
  }
});

class DashboardPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: this.props.match.params.username,
      gamesAttended: 0,
      totalPosts: 0,
      wins: 0,
      losses: 0,
      totalBallparks: 0,
      lastGame: null,
      upcomingGames: [],
      recentPosts: [],
      modalOpen: true
    };
    this.handleUserChange = this.handleUserChange.bind(this);
    this.getPosts = this.getPosts.bind(this);
  }
  componentDidMount = () => {
    this.getDashboardData(this.props.match.params.username);
  };

  handleUserChange = (username) => {
    this.setState({modalOpen: true});
    this.getDashboardData(username);
  }

  getDashboardData = () => {
    let dashboardInfo = {};
    API.getGamesAttended()
      .then((res) => {
        dashboardInfo.totalGames = res.data.count;
        return API.getTotalPosts();
      }).then((res) => {
        dashboardInfo.totalPosts = res.data.count;
        return API.getTotalBallparks();
      }).then((res) => {
        dashboardInfo.totalBallparks = res.data.count;
        return API.getWins();
      }).then((res) => {
        dashboardInfo.wins = res.data.wins;
        return API.getLosses();
      }).then((res) => {
        dashboardInfo.losses = res.data.losses;
        return API.getLastGame();
      }).then((res) => {
        dashboardInfo.lastGame = res.data.game;
        return API.getUpcomingGames();
      }).then((res) => {
        dashboardInfo.upcomingGames = res.data.games;
        return API.getRecentPosts();
      }).then((res) => {
        dashboardInfo.recentPosts = res.data.posts;
        dashboardInfo.modalOpen = false;
        this.setState(dashboardInfo, () => {
          document.getElementById('page-content').classList.remove('hidden');
        });
      }).catch((err) => {
        console.log(err);
      });
  }

  getPosts = () => {
    API.getRecentPosts()
      .then((res) => {
        this.setState({recentPosts: res.data.posts});
      });
  }

  render() {
    const { userId, totalGames, totalPosts, totalBallparks, wins, losses, lastGame, upcomingGames, recentPosts } = this.state;
    const { classes } = this.props;
    
    if(!this.props.user) {
      return (
        <Redirect to="/"/>
      );
    }
    return (
      <div>
        <Row id="page-content" className="hidden">
          <Col md={8}>
            <Typography variant="headline">
              <i className="fas fa-angle-right"></i> <strong>Your Statcard</strong>
            </Typography>
            <Row>
              <Col md={3}>
                <Paper className={classes.statPaper}>
                  <Typography className="white" variant="display3">
                    {totalGames}
                  </Typography>
                  <Typography className={`white ${classes.statSubhead}`} variant="subheading">
                    # of games attended
                  </Typography>
                </Paper>
              </Col>
              <Col md={3}>
                <Paper className={classes.statPaper}>
                  <Typography className="white" variant="display3">
                    {totalPosts}
                  </Typography>
                  <Typography className={`white ${classes.statSubhead}`} variant="subheading">
                    # of posts
                  </Typography>
                </Paper>
              </Col>
              <Col md={3}>
                <Paper className={classes.statPaper}>
                  <Typography className="white" variant="display3">
                    {totalBallparks}
                  </Typography>
                  <Typography className={`white ${classes.statSubhead}`} variant="subheading">
                    # of ballparks attended
                  </Typography>
                </Paper>
              </Col>
              <Col md={3}>
                <Paper className={classes.statPaper}>
                  <Typography className="white" variant="display3">
                    {wins} &ndash; {losses}
                  </Typography>
                  <Typography className={`white ${classes.statSubhead}`} variant="subheading">
                    W-L record
                  </Typography>
                </Paper>
              </Col>
            </Row>
            <Typography variant="headline">
              <i className="fas fa-angle-right"></i> <strong>Last Game</strong>
            </Typography>
            {lastGame ? (
              <GameList>
                <Game details={lastGame} userId={userId} />
              </GameList>
            ) : (
              <Paper className={classes.noResults}>
                You haven't attended any games yet.
              </Paper>
            )}
            <br/>
            <Typography variant="headline">
              <i className="fas fa-angle-right"></i> <strong>Upcoming Games</strong>
            </Typography>
            {upcomingGames.length ? (
              <GameList>
                {upcomingGames.map(game => (
                  <Game 
                    key={game.id} 
                    details={game}
                    userId={userId} />
                ))}
              </GameList>
            ) : (
              <Paper className={classes.noResults}>
                You have no upcoming games.
              </Paper>
            )}
          </Col>
          <Col md>
            <Typography variant="headline">
              <i className="fas fa-angle-right"></i> <strong>Recent Posts</strong>
            </Typography>
            <Paper className={classes.postPaper}>
              {recentPosts.length ? (
                <Scrollbars
                  style={{ height: 500, color: '#000' }} >
                  <div style={{ padding: 10 }}>
                    <PostList>
                      {recentPosts.map((post, index) => (
                        <Fragment key={`postFrament-${post.id}`}>
                          <Post key={post.id} 
                            postData={post} 
                            dashboard={true} 
                            handleUserChange={this.handleUserChange} 
                            getPosts={this.getPosts} />
                          {index !== recentPosts.length - 1 && 
                        <Divider className={classes.divider}/>
                          }
                        </Fragment>
                      ))}
                    </PostList>
                  </div>
                </Scrollbars>
              ) : (
                <Typography variant="subheading">
                There are currently no posts to show.
                </Typography>
              )}
              
            </Paper>
          </Col>
        </Row>
        <LoadingModal open={this.state.modalOpen} />
      </div>
    );
  }
}

export default withUser(withRouter(withStyles(styles)(DashboardPage)));