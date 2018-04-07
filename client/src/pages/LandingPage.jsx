import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import { withStyles } from 'material-ui/styles';
import { Redirect } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import LoginForm from '../components/LoginForm';
import { withUser } from '../services/withUser';
import { withRouter } from 'react-router-dom';
import bg from '../bg_light.jpg';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  heading: {
    textAlign: 'center',
    marginBottom: theme.spacing.unit * 2
  },
  subheading: {
    textAlign: 'center',
    marginBottom: theme.spacing.unit * 4
  },
  button: {
    marginTop: theme.spacing.unit * 2
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  control: {
    padding: theme.spacing.unit * 5,
  },
  menu: {
    width: 200,
  },
});

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: this.props.user ? true : false
    };
  }
  render() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const loggedIn = user && user.id === this.props.user.id ? true : false;
    const { classes } = this.props;
    
    if (loggedIn) {
      return (
        <Redirect to="/dashboard"/>
      );
    }
    
    return (
      <Fragment>
        <Row>
          <Col md>
            <Typography variant="display3" className={classes.heading}>Remember that one game?</Typography>
            <Typography variant="subheading" className={classes.subheading}>
              We do. And, we're sure someone else does, too. Find like-minded baseball fans who blah blah blah
            </Typography>
          </Col>
        </Row>
        <Row>
          <Col md/>
          <Col md={6}>
            <LoginForm authenticate={this.props.authenticate}/>
          </Col>
          <Col md/>
        </Row>
      </Fragment>
    );
  }
}

LandingPage.propTypes = {
  user: PropTypes.object.isRequired
};

export default withUser(withRouter(withStyles(styles)(LandingPage)));