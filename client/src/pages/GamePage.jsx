import React, { Fragment } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { Link } from 'react-router-dom';
import Typography from 'material-ui/Typography';
import moment from 'moment';
import API from '../utils/api';
import { withStyles } from 'material-ui/styles';
import { withUser } from '../services/withUser';
import LoadingModal from '../components/LoadingModal';
import Paper from 'material-ui/Paper';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import AttendButton from '../components/AttendButton';
import VenuePopover from '../components/VenuePopover';
import PostEditor from '../components/PostEditor';
import PostList from '../components/PostList';
import Post from '../components/Post';
import Button from 'material-ui/Button';
import Refresh from 'material-ui-icons/Refresh';

const BoxScoreCell = withStyles(theme => ({
  head: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: 13,
    border: 'none',
    color: '#999'
  },
  body: {
    fontSize: 16,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    paddingTop: 0,
    paddingBottom: 0,
    border: 'none'
  },
}))(TableCell);

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit,
  },
  boxScoreLogo: {
    width: 30,
    height: 'auto'
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
    textAlign: 'center',
    marginBottom: theme.spacing.unit * 2
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
  boxScore: {
    overflowX: 'auto',
    backgroundColor: '#fff',
    border: `1px solid ${theme.palette.secondary.dark}`,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: theme.spacing.unit * 3
  },
  runs: {
    color: theme.palette.primary.light,
    fontWeight: 'bold'
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
  },
  tickets: {
    fontSize: 18,
    fontWeight: 700
  },
  errorPaper: {
    backgroundColor: theme.palette.primary.light,
    fontSize: 24,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing.unit * 2
  },
  loadingBoxscore: {
    backgroundColor: theme.palette.secondary.light,
    fontSize: 18,
    color: theme.palette.secondary.contrastText,
    textAlign: 'center',
    padding: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
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
      posts: [],
      boxScore: {},
      attendees: 0
    };
    this.addAttendance = this.addAttendance.bind(this);
    this.deleteAttendance = this.deleteAttendance.bind(this);
    this.getPosts = this.getPosts.bind(this);
  }

  componentDidMount = () => {
    let attendees = 0;
    let boxScore = {};
    API.getAttendees(this.state.gameId)
      .then((res) => {
        attendees = res.data.attendees;
        return API.getGameInfo(this.state.gameId);
      })
      .then((res) => {
        if(res.data.game) {
          const game = res.data.game;
          const isAttending = game.attendances.length > 0 ? true : false;
          this.setState({
            gameDate: game.gameDate,
            gameTime: game.gameTime,
            homeTeam: game.Home,
            awayTeam: game.Away,
            homeTeamScore: game.homeTeamScore,
            awayTeamScore: game.awayTeamScore,
            season: game.season,
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
            url: game.url,
            attendees: attendees,
            attendeesCount: attendees.length,
            boxScore: boxScore
          }, () => {
            if (this.state.homeTeamScore !== null && this.state.awayTeamScore !== null) {
              document.getElementById('loading-boxscore').classList.remove('hidden');
              this.getBoxScore();
            }
            this.getPosts();
          });
        } else {
          this.setState({modalOpen: false});
          document.getElementById('no-game').classList.remove('hidden');
          return false;
        }
      });
  };

  getBoxScore = () => {
    API.getBoxScore(this.state.gameId, this.state.season)
      .then((res) => {
        this.setState({
          boxScore: res.data.gameboxscore
        }, () => {
          document.getElementById('loading-boxscore').classList.add('hidden');
        });
      });
  }

  getPosts = () => {
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
      .then(() => {
        this.setState({isAttending: true, attendeesCount: this.state.attendeesCount + 1});
      });
  }

  deleteAttendance = (id) => {
    API.deleteAttendance(id)
      .then(() => {
        this.setState({isAttending: false, attendeesCount: this.state.attendeesCount - 1});
      });
  }

  render() {
    const { gameId, gameDate, gameTime, homeTeam, awayTeam, homeTeamScore, awayTeamScore, isAttending, posts, url, attendees, attendeesCount, boxScore } = this.state;
    const { venueName, venueAddress, venueCity, venueState, venueZip, venueCapacity, venueType, venueSurface, venueDimensions } = this.state;
    const { classes } = this.props;
    const gameDateTime = moment(gameDate, 'YYYY-MM-DD HH:mm:ss');

    return (
      <Fragment>
        <Row id="no-game" className="hidden">
          <Col md>
            <Paper className={classes.errorPaper}>
              Sorry, we can't find the game you're looking for!
            </Paper>
          </Col>
        </Row>
        <div id="page-content" className="hidden">
          <Typography variant="display1" className={`${classes.gameHeader}`}>
            <Link to={`/team/${awayTeam.id}`}><strong>{awayTeam.city} {awayTeam.name}</strong></Link> <small>at</small> <Link to={`/team/${homeTeam.id}`}><strong>{homeTeam.city} {homeTeam.name}</strong></Link>
          </Typography>
          <Row>
            <Col lg={3}>
              <Paper className={classes.gameInfo}>
                <Row>
                  <Col md>
                    <Link className="plainLink" to={`/team/${awayTeam.id}`}>
                      <img className="img-fluid" src={`/img/logos/${awayTeam.logo}`} alt={`${awayTeam.city} ${awayTeam.name} logo`}/>
                    </Link>
                  </Col>
                  <Col md>
                    <Link className="plainLink" to={`/team/${homeTeam.id}`}>
                      <img className="img-fluid" src={`/img/logos/${homeTeam.logo}`} alt={`${homeTeam.city} ${homeTeam.name} logo`}/>
                    </Link>
                  </Col>
                </Row>
                <br/>
                <Row>
                  <Col lg={12}>
                    <div className={classes.section} style={{margin: '0 auto', textAlign:'center'}}>
                      <Typography variant="headline" className="text-center bold">Date and Time</Typography>
                      <Typography variant="subheading" className={`${classes.dateTime}`}>
                        {moment(gameDateTime).format('dddd, MMMM Do, YYYY')}<br/>
                        {moment(gameTime, 'HH:mm:ss').format('h:mm a')}
                      </Typography>
                      <br/>
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
                      <br/>
                      {attendeesCount > 0 && (
                        <Fragment>
                          <Typography variant="subheading" className="bold">
                            {`${attendeesCount} user${attendeesCount > 1 ? 's' : ''} ${moment().diff(gameDateTime, 'hours') > -1 && moment().diff(gameDateTime, 'hours') < 3 ? 'should be at this game right now!' : (moment().diff(gameDateTime, 'hours') >= 3 ? 'went to this game.' : `plan${attendeesCount > 1 ? '': 's'} on going to this game.`)}`}
                          </Typography>
                          <br/>
                        </Fragment>
                      )}
                      <AttendButton 
                        variant="raised"
                        color="primary"
                        gameId={gameId} 
                        gameDate={gameDate} 
                        gameTime={gameTime}
                        addAttendance={this.addAttendance} 
                        deleteAttendance={this.deleteAttendance} 
                        isAttending={isAttending}
                        size="medium"
                        className={classes.attendButton}
                      />
                      <br/>
                      {(moment(gameDate) > moment() && url && (
                        <Typography variant="subheading" className={classes.tickets}>
                          <Link to={url} target="_blank">
                      Buy Tickets
                          </Link>
                        </Typography>
                      ))}
                    </div>
                
                  </Col>
                </Row>
              </Paper>
            </Col>
            <Col lg={9}>
              <Row>
                <Col lg={12} className={classes.mainContent}>
                  {homeTeamScore !== null && awayTeamScore !== null && (
                    <Paper className={`${classes.paper} ${classes.scorePaper}`}>
                      <Typography variant="headline" className="text-center bold" style={{color: '#FFFFFF'}}>Final Score</Typography>
                      <Typography variant="headline" className="text-center" style={{color: '#FFFFFF'}}><small>{awayTeam.name} {awayTeamScore}, {homeTeam.name} {homeTeamScore}</small></Typography>
                    </Paper>
                  )}
                  <Paper className={`hidden ${classes.loadingBoxscore}`} id="loading-boxscore">
                    <i className="fas fa-cog fa-spin white"></i> Getting Boxscore...
                  </Paper>
                  {boxScore.game && (
                    <Paper className={classes.boxScore}>
                      <Table>
                        <TableHead>
                          <TableRow key="1">
                            <BoxScoreCell></BoxScoreCell>
                            <BoxScoreCell></BoxScoreCell>
                            {boxScore.inningSummary.inning.map(n => {
                              return <BoxScoreCell key={n['@number']}>{n['@number']}</BoxScoreCell>;
                            })}
                            <BoxScoreCell>R</BoxScoreCell>
                            <BoxScoreCell>H</BoxScoreCell>
                            <BoxScoreCell>E</BoxScoreCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow key="2">
                            <BoxScoreCell style={{paddingRight: 0}}>
                              <img src={`/img/logos/${awayTeam.logo}`} className={classes.boxScoreLogo}/>
                            </BoxScoreCell>
                            <BoxScoreCell style={{paddingLeft : 0}}>
                              {boxScore.game.awayTeam.Name}
                            </BoxScoreCell>
                            {boxScore.inningSummary.inning.map(n => {
                              return <BoxScoreCell key={n['@number']}>{n['awayScore']}</BoxScoreCell>;
                            })}
                            <BoxScoreCell><span className={classes.runs}>{boxScore.awayTeam.awayTeamStats.Runs['#text']}</span></BoxScoreCell>
                            <BoxScoreCell>{boxScore.awayTeam.awayTeamStats.Hits['#text']}</BoxScoreCell>
                            <BoxScoreCell>{boxScore.awayTeam.awayTeamStats.Errors['#text']}</BoxScoreCell>
                          </TableRow>
                          <TableRow key="3">
                            <BoxScoreCell style={{paddingRight: 0}}>
                              <img src={`/img/logos/${homeTeam.logo}`} className={classes.boxScoreLogo}/>
                            </BoxScoreCell>
                            <BoxScoreCell style={{paddingLeft: 0}}>
                              {boxScore.game.homeTeam.Name}
                            </BoxScoreCell>
                            {boxScore.inningSummary.inning.map(n => {
                              return <BoxScoreCell key={n['@number']}>{n['homeScore']}</BoxScoreCell>;
                            })}
                            <BoxScoreCell><span className={classes.runs}>{boxScore.homeTeam.homeTeamStats.Runs['#text']}</span></BoxScoreCell>
                            <BoxScoreCell>{boxScore.homeTeam.homeTeamStats.Hits['#text']}</BoxScoreCell>
                            <BoxScoreCell>{boxScore.homeTeam.homeTeamStats.Errors['#text']}</BoxScoreCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Paper>
                  )}
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <div className={classes.section}>
                    <Paper>
                      <PostEditor gameId={gameId} getPosts={this.getPosts}/>
                    </Paper>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={8}>
                  {posts.length ? ( <Typography className={classes.bold} variant="subheading"><strong>{posts.length}</strong> post{posts.length > 1 ? 's' : ''} for this game.</Typography>)
                    :
                    (<Typography variant="subheading" className={classes.bold}>
                    There are no posts for this game... yet.
                    </Typography>)}  
                </Col>
                <Col md>
                  <div style={{textAlign:'right'}}>
                    <Button variant="raised" color="secondary" size="large" onClick={this.getPosts}>
                      <Refresh className={classes.iconLeft}/> Refresh Posts
                    </Button>   
                  </div>             
                </Col>
              </Row>
              <Row>
                <Col md>
                  <PostList>
                    { posts.map(post => (
                      <Post key={post.id} postData={post} gameDate={gameDate} getPosts={this.getPosts} />
                    ))}
                  </PostList>
                </Col>
              </Row>
            </Col>
          </Row>
          <LoadingModal open={this.state.modalOpen} />
        </div>
      </Fragment>
    );
  }
}

export default withUser(withStyles(styles)(GamePage));