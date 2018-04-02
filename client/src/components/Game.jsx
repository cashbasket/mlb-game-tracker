import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import { withRouter } from 'react-router-dom';
import Grid from 'material-ui/Grid';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { withUser } from '../services/withUser';
import moment from 'moment';
import Button from 'material-ui/Button';
import Info from 'material-ui-icons/Info';
import AttendButton from './AttendButton';
import API from '../utils/api';

const styles = theme => ({
  card: {
    display: 'flex',
    marginBottom: 15
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
    height: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit / 2,
  },
  iconSmall: {
    fontSize: 20,
  }
});

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAttending: false
    };
    this.addAttendance = this.addAttendance.bind(this);
    this.deleteAttendance = this.deleteAttendance.bind(this);
  }

  componentDidMount = () => {
    this.setState({isAttending: this.props.details.attendances.length > 0 ? true : false});
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
    const { classes } = this.props;
    const { id, Away, Home, gameDate, gameTime } = this.props.details;
    const { isAttending } = this.state;
    return (
      <li>
        <div>
          <Card className={classes.card}>
            <div>
              <CardContent className={classes.content}>
                <Typography variant="headline">
                  {this.props.teamId == Away.id ? (
                    <div>
                      {Away.city} {Away.name} <small>at</small> <Link to={`/team/${Home.id}`} onClick={() => this.props.handleTeamChange(Home.id)}>{Home.city} {Home.name}</Link>
                    </div>
                  ) : (
                    <div>
                      <Link to={`/team/${Away.id}`} onClick={() => this.props.handleTeamChange(Away.id)}>{Away.city} {Away.name}</Link> <small>at</small> {Home.city} {Home.name}
                    </div>
                  )}
                </Typography>
                <Typography variant="subheading" color="textSecondary">
                  {moment(gameDate).format('M/D/YYYY')} at {moment(gameTime, 'HH:mm:ss').format('h:mm A')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" component={Link} to={`/game/${id}`}>
                  <Info className={classes.leftIcon}/>
                  View Game Page
                </Button>
                <AttendButton 
                  gameId={id} 
                  gameDate={gameDate} 
                  gameTime={gameTime} 
                  addAttendance={this.addAttendance} 
                  deleteAttendance={this.deleteAttendance} 
                  isAttending={isAttending}
                />
              </CardActions>
            </div>
          </Card>
        </div>
      </li>
    );}
}

export default withUser(withRouter(withStyles(styles)(Game)));
