import React from 'react';
import API from '../utils/api';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import { Redirect } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Snackbar from 'material-ui/Snackbar';

const styles = theme => ({
  root: {
    flexGrow: 1
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

class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {
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
            this.setState({ redirectToReferrer: true });
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
    const { redirectToReferrer } = this.state;
    const { classes } = this.props;
    
    if (redirectToReferrer) {
      return (
        <Redirect to={from}/>
      );
    }
    
    return (
      <Grid container justify="center">
        <Snackbar
          open={this.state.snackbarOpen}
          onClose={this.handleSnackbarClose}
          SnackbarContentProps={{
            'aria-describedby': 'registerInfo',
          }}
          message={<span id="registerInfo">{this.state.snackbarMessage}</span>}
        />
        <Grid item md={6} sm={10} xs={10}> 
          <Paper className={classes.control}>
            <Typography variant="title" gutterBottom align="center">
               Log In
            </Typography>
            <Grid container spacing={0}
              alignItems="center"
              direction="column"
              justify="center">
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
                <Grid item md={12}>
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
                </Grid>
                <Grid item md={12}>
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
                </Grid>
                <Grid item md={12}>
                  <Grid container spacing={0} justify="center">
                    <Button type="submit" variant="raised" color="primary" className={classes.button}>
                    Submit
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Login);