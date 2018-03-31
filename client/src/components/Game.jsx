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
import CheckBox from 'material-ui-icons/CheckBox';
import CheckBoxOutline from 'material-ui-icons/CheckBoxOutlineBlank';
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
    const { classes, theme, details, user } = this.props;
    return (
      <li>
        <div>
          <Card className={classes.card}>
            <div>
              <CardContent className={classes.content}>
                <Typography variant="headline">
                  {this.props.teamId == this.props.details.Away.id ? (
                    <div>
                      {this.props.details.Away.city} {this.props.details.Away.name} <small>at</small> <Link to={`/team/${this.props.details.Home.id}`} onClick={() => this.props.handleTeamChange(this.props.details.Home.id)}>{this.props.details.Home.city} {this.props.details.Home.name}</Link>
                    </div>
                  ) : (
                    <div>
                      <Link to={`/team/${this.props.details.Away.id}`} onClick={() => this.props.handleTeamChange(this.props.details.Away.id)}>{this.props.details.Away.city} {this.props.details.Away.name}</Link> <small>at</small> {this.props.details.Home.city} {this.props.details.Home.name}
                    </div>
                  )}
                </Typography>
                <Typography variant="subheading" color="textSecondary">
                  {moment(this.props.details.gameDate).format('M/D/YYYY')} at {moment(this.props.details.gameTime, 'HH:mm:ss').format('h:mm A')} (EST)
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" component={Link} to={`/game/${this.props.details.id}`}>
                  <Info className={classes.leftIcon}/>
                  View Game Page
                </Button>
                {user && <Button size="small" color="primary" onClick={() => !this.state.isAttending ? this.addAttendance(user.id, this.props.details.id) : this.deleteAttendance(this.props.details.attendances[0].id)}>
                  {this.state.isAttending ? (
                    <CheckBox className={classes.leftIcon}/>
                  ) : (
                    <CheckBoxOutline className={classes.leftIcon}/>
                  )}
                  {moment(this.props.details.gameDate) >= moment(new Date()) ? 'I\'m Going' : 'I Went'} to this game
                </Button>
                }
              </CardActions>
            </div>
          </Card>
        </div>
      </li>
    );}
}

export default withUser(withRouter(withStyles(styles)(Game)));
