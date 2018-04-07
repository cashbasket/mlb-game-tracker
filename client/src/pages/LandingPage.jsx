import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import { withStyles } from 'material-ui/styles';
import { Redirect } from 'react-router-dom';
import Typography from 'material-ui/Typography';
import LoginForm from '../components/LoginForm';
import { withUser } from '../services/withUser';
import { withRouter } from 'react-router-dom';
import LandingPageBg from '../bg_light.jpg';

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

  componentDidMount = () => {
    let elem = document.querySelector('body');
    elem.style.backgroundImage = `url(${LandingPageBg})`;
  }

  componentWillUnmount = () => {
    let elem = document.querySelector('body');
    elem.style.backgroundImage = 'none';
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
            <Typography variant="display3" className={classes.heading}>Remember the game?</Typography>
            <Typography variant="subheading" className={classes.subheading}>
              We do, and we're sure someone else does, too. <strong>WENT YARD</strong> is a site built for baseball fans, by baseball fans. Track your favorite team, track your own personal game attendance history, and chat with like-minded fans who just might have been there with you!
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

export default withUser(withRouter(withStyles(styles)(LandingPage)));