import React, { Fragment } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Link, withRouter } from 'react-router-dom';
import Typography from 'material-ui/Typography';
import moment from 'moment';
import API from '../utils/api';
import Refresh from 'material-ui-icons/Refresh';
import AttachMoney from 'material-ui-icons/AttachMoney';
import { withStyles } from 'material-ui/styles';
import { withUser } from '../services/withUser';
import LoadingModal from '../components/LoadingModal';
import Paper from 'material-ui/Paper';
import AttendButton from '../components/AttendButton';
import VenuePopover from '../components/VenuePopover';
import PostEditor from '../components/PostEditor';
import PostList from '../components/PostList';
import Post from '../components/Post';
import Button from 'material-ui/Button';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit,
  },
  gameInfo: {
    padding: theme.spacing.unit * 2,
    backgroundColor: '#b0bec5',
    border: `1px solid ${theme.palette.secondary.dark}`
  },
  section: {
    marginBottom: theme.spacing.unit * 3
  },
  gameHeader: {
    textAlign: 'center'
  },
  attendButton: {
    fontSize: 20,
    marginBottom: theme.spacing.unit
  },
  buyTickets: {
    marginBottom: theme.spacing.unit * 3,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2
  },
  scorePaper: {
    backgroundColor: theme.palette.secondary.dark,
    color: '#FFFFFF',
    marginBottom: theme.spacing.unit * 3
  },
  dateTime: {
    fontSize: 20,
    textAlign: 'center',
  },
  bold: {
    fontWeight: 700
  },
  details: {
    backgroundColor: '#fff',
    padding: theme.spacing.unit * 2,
    minHeight: 125,
    marginBottom: theme.spacing.unit * 3
  },
  leftIcon: {
    marginRight: 5
  },
  refresh: {
    backgroundColor: theme.palette.primary.light
  },
  logo: {
    maxWidth: 160
  }
});

class GamePage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      gameId: this.props.match.params.gameId,
      homeTeam: {},
      awayTeam: {},
      url: '',
      gameDate: '',
      gameTime: '',
      homeTeamScore: null,
      awayTeamScore: null,
      venueName: '',
      venueAddress: '',
      venueCity: '',
      venueState: '',
      venueZip: '',
      venueCapacity: '',
      venueType: '',
      venueSurface: '',
      venueDimensions: '',
      isAttending: false,
      modalOpen: true,
      posts: []
    };
    this.addAttendance = this.addAttendance.bind(this);
    this.deleteAttendance = this.deleteAttendance.bind(this);
    this.getPosts = this.getPosts.bind(this);
  }

  componentDidMount = () => {
    API.getGameInfo(this.state.gameId)
      .then((res) => {
        const game = res.data.game;
        const isAttending = game.attendances.length > 0 ? true : false;
        this.setState({
          gameDate: game.gameDate,
          gameTime: game.gameTime,
          homeTeam: game.Home,
          awayTeam: game.Away,
          homeTeamScore: game.homeTeamScore,
          awayTeamScore: game.awayTeamScore,
          venueName: game.venue.name,
          venueAddress: game.venue.address,
          venueCity: game.venue.city,
          venueState: game.venue.state,
          venueZip: game.venue.zip,
          venueCapacity: game.venue.capacity,
          venueType: game.venue.stadiumType,
          venueSurface: game.venue.surface,
          venueDimensions: game.venue.dimensions,
          isAttending: isAttending,
          url: game.url
        }, () => {
          this.getPosts(this.state.gameId);
        });
      });
  };

  getPosts = (gameId) => {
    API.getPosts(this.state.gameId)
      .then((res) => {
        this.setState({
          posts: res.data.posts,
          modalOpen: false
        }, () => 
          document.getElementById('page-content').classList.remove('hidden'));
      });
  }
  

  addAttendance = (userId, gameId) => {
    API.addAttendance(userId, gameId)
      .then((res) => {
        this.setState({isAttending: true});
      });
  }

  deleteAttendance = (id) => {
    API.deleteAttendance(id)
      .then((res) => {
        this.setState({isAttending: false});
      });
  }

  render() {
    const { gameId, gameDate, gameTime, homeTeam, awayTeam, homeTeamScore, awayTeamScore, isAttending, posts, url } = this.state;
    const { venueName, venueAddress, venueCity, venueState, venueZip, venueCapacity, venueType, venueSurface, venueDimensions } = this.state;
    const { classes } = this.props;
    const gameDateTime = moment(`${gameDate} ${gameTime}`, 'YYYY-MM-DD HH:mm:ss');
    return (
      <div>
        <Row id="page-content" className="hidden">
          <Col lg={4}>
            <Paper className={classes.gameInfo}>
              <Row>
                <Col lg={12}>
                  <Typography variant="display1" className={`${classes.gameHeader}`}>
                    <strong>{homeTeam.city} {homeTeam.name}</strong><br/><small>vs.</small><br/><strong>{awayTeam.city} {awayTeam.name}</strong>
                  </Typography>
                  <div className={classes.section} style={{margin: '0 auto', textAlign:'center'}}>
                    <br/>
                    <div>
                      <img className={classes.logo} src={`/img/logos/${homeTeam.logo}`}/><br/>
                      <img className={classes.logo} src={`/img/logos/${awayTeam.logo}`}/>
                    </div>
                    <br/>
                    <AttendButton 
                      variant="raised"
                      color="primary"
                      gameId={gameId} 
                      gameDate={gameDate} 
                      gameTime={gameTime}
                      addAttendance={this.addAttendance} 
                      deleteAttendance={this.deleteAttendance} 
                      isAttending={isAttending}
                      size="large"
                      className={classes.attendButton}
                    />
                    <br/>
                    {(moment(gameDate) > moment() && (
                      <Button size="small" variant="raised" color="secondary" className={classes.buyTickets} component={Link} to={url} target="_blank">
                        <AttachMoney className={classes.leftIcon}/>
                      Buy Tickets
                      </Button>
                    ))}
                  </div>
                
                </Col>
              </Row>
            </Paper>
          </Col>
          <Col lg>
            <Row>
              <Col lg={12} className={classes.mainContent}>
                {homeTeamScore !== null && awayTeamScore !== null && (
                  <Paper className={`${classes.paper} ${classes.scorePaper}`}>
                    <Typography variant="headline" className="text-center bold" style={{color: '#FFFFFF'}}>Final Score</Typography>
                    <Typography variant="headline" className="text-center" style={{color: '#FFFFFF'}}>{homeTeam.name} {homeTeamScore}, {awayTeam.name} {awayTeamScore}</Typography>
                  </Paper>
                )}
                <Row>
                  <Col lg={6}>
                    <Paper className={classes.details}>
                      <Typography variant="headline" className="text-center bold">Date and Time</Typography>
                      <Typography variant="subheading" className={`${classes.dateTime}`}>
                        {moment(gameDate).format('dddd, MMMM Do, YYYY')}<br/>
                        {moment(gameTime, 'HH:mm:ss').format('h:mm a')}
                      </Typography>
                    </Paper>
                  </Col>
                  <Col lg={6}>
                    <Paper className={classes.details}>
                      <Typography variant="headline" className="text-center bold">
                Game Location
                      </Typography>
                      <VenuePopover 
                        venueName={venueName} 
                        capacity={venueCapacity} 
                        type={venueType} 
                        surface={venueSurface} 
                        dimensions={venueDimensions}
                      />
                      <Typography variant="subheading" className="text-center">
                        {venueAddress}<br/>
                        {venueCity}, {venueState} {venueZip}
                      </Typography>
                    </Paper>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <div className={classes.section}>
                  <Typography variant="headline" className="text-center bold">
                    Game Discussion
                  </Typography>
                  <PostEditor gameId={gameId} getPosts={this.getPosts}/>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Row>
                  <Col md={6}>
                    {posts.length ? ( <Typography className={classes.bold} variant="subheading"><strong>{posts.length}</strong> post{posts.length > 1 ? 's' : ''} for this game.</Typography>)
                      :
                      (<Typography variant="subheading" className={classes.bold}>
                    There are no posts for this game.
                      </Typography>)}                  </Col>
                  <Col md={6} style={{textAlign: 'right'}}>
                    <Button 
                      variant="raised" 
                      color="primary"
                      className={classes.refresh} 
                      size="large"
                      onClick={() => this.getPosts(gameId)}>
                      <Refresh className={classes.leftIcon}/>Refresh Posts
                    </Button>
                  </Col>
                </Row>
                <PostList>
                  { posts.map(post => (
                    <Post key={post.id} postData={post} getPosts={this.getPosts}/>
                  ))}
                </PostList>
              </Col>
            </Row>
          </Col>
        </Row>
        <LoadingModal open={this.state.modalOpen} />
      </div>
    );
  }
}

export default withUser(withStyles(styles)(GamePage));