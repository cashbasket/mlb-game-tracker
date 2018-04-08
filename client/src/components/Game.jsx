import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'react-flexbox-grid';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { withUser } from '../services/withUser';
import moment from 'moment';
import Button from 'material-ui/Button';
import Info from 'material-ui-icons/Info';
import AttachMoney from 'material-ui-icons/AttachMoney';
import AttendButton from './AttendButton';
import API from '../utils/api';

const styles = theme => ({
  card: {
    marginBottom: 15
  },
  gameTitle: {
    fontSize: 20
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
    height: 151,
  },
  controls: {
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit / 3,
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
      .then(() => {
        this.setState({isAttending: true});
      });
  }

  deleteAttendance = (id) => {
    API.deleteAttendance(id)
      .then(() => {
        this.setState({isAttending: false});
      });
  }

  render() {
    const { classes } = this.props;
    const { id, Away, Home, gameDate, gameTime, url } = this.props.details;
    const { isAttending } = this.state;
    return (
      <li>
        <div>
          <Card className={classes.card}>
            <Row>
              <Col md>
                <CardContent className={classes.content}>
                  <Typography className={classes.gameTitle} variant="headline">
                    {this.props.teamId ? (
                      <Fragment>
                        {this.props.teamId == Away.id ? (
                          <div>
                            {Away.city} {Away.name} <small>at</small> <Link to={`/team/${Home.id}`} onClick={() => this.props.handleTeamChange(Home.id)}>{Home.city} {Home.name}</Link>
                          </div>
                        ) : (
                          <div>
                            <Link to={`/team/${Away.id}`} onClick={() => this.props.handleTeamChange(Away.id)}>{Away.city} {Away.name}</Link> <small>at</small> {Home.city} {Home.name}
                          </div>
                        )}
                      </Fragment>
                    ) : (
                      <Fragment>
                        <Link to={`/team/${Away.id}`} onClick={() => this.props.handleTeamChange(Away.id)}>{Away.city} {Away.name}</Link> <small>at</small> <Link to={`/team/${Home.id}`}>{Home.city} {Home.name}</Link>
                      </Fragment>
                    )}         
                  </Typography>
                  <Typography variant="subheading" color="textSecondary">
                    {moment(gameDate).format('M/D/YYYY')} at {moment(gameTime, 'HH:mm:ss').format('h:mm A')}
                  </Typography>
                </CardContent>
              </Col>
            </Row>
            <Row>
              <Col md>
                <CardActions>
                  <Row style={{minWidth: '85%'}}>
                    <Col md={3}>
                      <Button size="small" color="primary" className={`plainLink ${classes.controls}`} component={Link} to={`/game/${id}`}>
                        <Info className={classes.leftIcon}/>
                      Game Details
                      </Button>
                    </Col>
                    {(moment(gameDate) > moment() && url && (
                      <Col md={3}>
                        <Button size="small" color="primary" className={`plainLink ${classes.controls}`} component={Link} to={url} target="_blank">
                          <AttachMoney className={classes.leftIcon}/>
                      Buy Tickets
                        </Button>
                      </Col>
                    ))}
                    {(!this.props.userId || ((this.props.userId && this.props.user) && this.props.user.id === this.props.userId)) &&
                  <Col md>
                    <AttendButton 
                      gameId={id} 
                      gameDate={gameDate} 
                      gameTime={gameTime}
                      addAttendance={this.addAttendance} 
                      deleteAttendance={this.deleteAttendance} 
                      isAttending={isAttending}
                      color="primary"
                      size="small"
                    />
                  </Col>}
                  </Row>
                </CardActions>
              </Col>
            </Row>
          </Card>
        </div>
      </li>
    );}
}

export default withUser(withRouter(withStyles(styles)(Game)));
