import React from 'react';
import API from '../utils/api';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import { Redirect } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import MenuItem from 'material-ui/Menu/MenuItem';
import Snackbar from 'material-ui/Snackbar';
import { withUser } from '../services/withUser';
import { withRouter } from 'react-router-dom';


const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
const usernameHelper = 'Valid usernames must contain only alphanumeric characters and be between 3 and 20 characters in length.';
const passwordHelper = 'Valid passwords must be between 8 and 16 chracters, and include at least one upper case letter, one lower case letter, and one numeric digit.';
const favoriteTeamHelper = 'You must choose your favorite MLB team. No one will judge you based on which team you choose; we promise.';

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

class Register extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mlbTeams: [],
      email: '',
      username: '',
      password: '',
      favoriteTeam: '',
      usernameError: false,
      passwordError: false,
      favoriteTeamError: false,
      usernameErrorText: usernameHelper,
      passwordErrorText: passwordHelper,
      favoriteTeamErrorText: favoriteTeamHelper,
      snackbarMessage: '',
      snackbarOpen: false,
      registered: false
    };
  }

  componentDidMount = () => {
    API.getAllTeams().then((res) => {
      const mlbTeams = [];
      res.data.teams.map(team => (
        mlbTeams.push({
          id: team.id,
          name: `${team.city} ${team.name}`
        })
      ));
      this.setState({mlbTeams: mlbTeams});
    });
  };

  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false });
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
    if(name === 'username' && !value.match(usernameRegex)) {
      this.setState({usernameErrorText: usernameHelper, usernameError: true});
    } else if (name === 'username' && value.match(usernameRegex)) {
      this.setState({usernameErrorText: '', usernameError: false});
    } else if (name === 'password' && !value.match(passwordRegex)) {
      this.setState({passwordErrorText: passwordHelper, passwordError: true});
    } else if (name === 'password' && value.match(passwordRegex)) {
      this.setState({passwordErrorText: '', passwordError: false});
    } else if (name === 'favoriteTeam' && !value) {
      this.setState({favoriteTeamErrorText: favoriteTeamHelper, favoriteTeamError: true});
    } else if (name === 'favoriteTeam' && value) {
      this.setState({favoriteTeamErrorText: '', favoriteTeamError: false});
    }
  };
  
  register = () => {
    const userData = {
      email: this.state.email,
      password: this.state.password,
      username: this.state.username,
      teamId: this.state.favoriteTeam
    };
    if (userData.username.match(usernameRegex) && 
    userData.password.match(passwordRegex) && 
    userData.teamId) {
      API.register(userData)
        .then((response) => {
          if(response.data.message) {
            this.setState({snackbarMessage: response.data.message, snackbarOpen: true});
          } else {
            return API.login(userData);
          }
        })
        .then((response) => {
          // const profileUrl = `/users/${userData.username}`;
          if(response){
            this.props.authenticate(() => {
              this.setState({registered: true});
            });
          }
        })
        .catch((err) => {
          console.log('Error registering user.', err);
        });
    }
  }

  render() {
    const { classes } = this.props;
    const { registered } = this.state;
    if(registered) {
      return (
        <Redirect to={`/user/${this.props.user.username}`}/>
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
               Sign Up
            </Typography>
            
            <Grid container spacing={0}
              alignItems="center"
              direction="column"
              justify="center">
              <form
                style={{width: '100%'}}
                onSubmit={(e) => {
                  e.preventDefault();
                  return this.register();
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
                    onChange={this.handleInputChange.bind(this)}
                    required={true}
                  />
                </Grid>
                <Grid item md={12}>
                  <TextField
                    fullWidth 
                    id="password-input"
                    label="Create a Password"
                    inputRef={(input) => this.passwordElem = input}
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    margin="normal"
                    required={true}
                    error={this.state.passwordError}
                    helperText= {this.state.passwordErrorText}
                    onChange={this.handleInputChange.bind(this)}
                  />
                </Grid>
                <Grid item md={12}>
                  <TextField
                    fullWidth 
                    id="username-input"
                    label="Choose a Username"
                    inputRef={(input) => this.emailElem = input}
                    name="username"
                    type="text"
                    autoComplete="current-username"
                    margin="normal"
                    required={true}
                    error={this.state.usernameError}
                    helperText={this.state.usernameErrorText}
                    onChange={this.handleInputChange.bind(this)}
                  />
                </Grid>
                <Grid item md={12}>
                  <TextField
                    fullWidth
                    select
                    required
                    label="Favorite MLB Team"
                    name="favoriteTeam"
                    margin="normal"
                    value={this.state.favoriteTeam}
                    onChange={this.handleInputChange.bind(this)}
                    helperText={this.state.favoriteTeamErrorText}
                    error={this.state.favoriteTeamError}
                  >
                    <MenuItem value="" />
                    {this.state.mlbTeams.map(team => (
                      <MenuItem key={team.id} value={team.id}>
                        {team.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item md={12}>
                  <Grid container spacing={0} justify="center">
                    <Button type="submit" variant="raised" color="primary" className={classes.button}>
                    Create Account
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

export default withUser(withRouter(withStyles(styles)(Register)));