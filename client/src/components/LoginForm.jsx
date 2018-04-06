import React, { Fragment } from 'react';
import API from '../utils/api';
import { Row, Col } from 'react-flexbox-grid';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import { Redirect } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Snackbar from 'material-ui/Snackbar';
import { withUser } from '../services/withUser';
import { withRouter, Link } from 'react-router-dom';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 2
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

class LoginForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loggedIn: false,
      redirectToReferrer: false,
      snackbarOpen: false,
      snackbarMessage: ''
    };
  }

  form: null;
  emailElem: null;
  passwordElem: null;

  login = (data) => {
    API.login(data)
      .then((response) => {
        if(response.data.message) {
          this.setState({snackbarMessage: response.data.message, snackbarOpen: true});
        } else {
          this.props.authenticate(() => {
            if (!this.props.location.state) {
              this.setState({ loggedIn: true });
            } else {
              this.setState({ redirectToReferrer: true });
            }
          });
        }
      })
      .catch((err) => {
        console.log('Error logging in.', err);
      });
  }

  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false });
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { loggedIn, redirectToReferrer } = this.state;
    const { classes } = this.props;
    
    if (loggedIn) {
      return (
        <Redirect to="/dashboard"/>
      );
    }
    if (redirectToReferrer) {
      return (
        <Redirect to={from}/>
      );
    }
    
    return (
      <Fragment>
        <Snackbar
          open={this.state.snackbarOpen}
          onClose={this.handleSnackbarClose}
          SnackbarContentProps={{
            'aria-describedby': 'registerInfo',
          }}
          message={<span id="registerInfo">{this.state.snackbarMessage}</span>}
        />
        <Paper className={classes.control}>
          <Typography variant="headline" gutterBottom align="center">
               Log In
          </Typography>
          <form
            ref={(elem) => this.form = elem}
            style={{width: '100%'}}
            onSubmit={(e) => {
              e.preventDefault();
              return this.login({
                email: this.emailElem.value,
                password: this.passwordElem.value
              });
            }}
          >
            <Row>
              <Col md>
                <TextField
                  fullWidth 
                  id="email-input"
                  label="Enter Your Email Address"
                  inputRef={(input) => this.emailElem = input}
                  name="email"
                  type="email"
                  autoComplete="current-email"
                  margin="normal"
                  required={true}
                />
              </Col>
            </Row>
            <Row>
              <Col md>
                <TextField
                  fullWidth 
                  id="password-input"
                  label="Enter Your Password"
                  inputRef={(input) => this.passwordElem = input}
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  margin="normal"
                  required={true}
                />
              </Col>
            </Row>
            <Row>
              <Col md>
                <div style={{textAlign: 'center'}}>
                  <Button type="submit" variant="raised" color="primary" className={classes.button}>
                  Submit
                  </Button>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12} style={{textAlign: 'center'}}>
                <Typography variant="subheading">
                  Need an account? <Link to="/register">Sign up here</Link>.
                </Typography>
                <Typography variant="subheading">
                  Forget your password? <Link to="/forgot">We got you covered</Link>.
                </Typography>
              </Col>
            </Row>
          </form>
        </Paper>
      </Fragment>
    );
  }
}

export default withUser(withRouter(withStyles(styles)(LoginForm)));