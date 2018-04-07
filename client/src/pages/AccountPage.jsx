import React from 'react';
import API from '../utils/api';
import { Row, Col } from 'react-flexbox-grid';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import MenuItem from 'material-ui/Menu/MenuItem';
import Snackbar from 'material-ui/Snackbar';
import { withUser } from '../services/withUser';
import { withRouter } from 'react-router-dom';
import LoadingModal from '../components/LoadingModal';

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
const passwordHelper = 'Valid passwords must be between 8 and 16 chracters, and include at least one upper case letter, one lower case letter, and one numeric digit.';
const confirmPasswordHelper = 'Password fields must match!';
const confirmEmailHelper = 'Email fields must match!';
const favoriteTeamHelper = 'You must choose your favorite MLB team. No one will judge you based on which team you choose; we promise.';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  avatar: {
    maxWidth: 125,
    width: '100%',
    height: 'auto',
    margin: '0 auto',
  },
  paper: {
    padding: theme.spacing.unit * 4
  },
  button: {
    marginTop: theme.spacing.unit * 2
  },
  textarea: {
    backgroundColor: '#fff',
    border: '1px solid #000',
    height: 75
  },
  gravatarInfo: {
    margin: '15px 0 30px 0'
  }
  
});

class AccountPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      gravatar: '',
      mlbTeams: [],
      email: '',
      confirmEmail: '',
      password: '',
      confirmPassword: '',
      favoriteTeam: '',
      name: '',
      description: '',
      passwordError: false,
      confirmPasswordError: false,
      favoriteTeamError: false,
      emailConfirmError: false,
      confirmEmailText: confirmEmailHelper,
      confirmPasswordText: confirmPasswordHelper,
      passwordErrorText: passwordHelper,
      favoriteTeamErrorText: favoriteTeamHelper,
      snackbarMessage: '',
      snackbarOpen: false,
      modalOpen: true
    };
  }

  componentDidMount = () => {
    let accountObj = {};
    API.getAccountInfo()
      .then((res) => {
        accountObj.gravatar = res.data.user.gravatar;
        accountObj.email = res.data.user.email;
        accountObj.name = res.data.user.name;
        accountObj.confirmEmail = res.data.user.email;
        accountObj.description = res.data.user.description;
        accountObj.favoriteTeam = res.data.user.teamId;
        accountObj.mlbTeams = [];
        accountObj.modalOpen = false;
        return API.getAllTeams();
      }).then((res) => {
        res.data.teams.map(team => {
          accountObj.mlbTeams.push({
            id: team.id,
            name: `${team.city} ${team.name}`
          });
        });
        this.setState(accountObj, () => {
          document.getElementById('page-content').classList.remove('hidden');
        });
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

    if(name ==='email') {
      if (value !== this.state.confirmEmail) {
        this.setState({emailConfirmError: true});
      } else {
        this.setState({emailConfirmError: false});
      }
    }

    if(name ==='confirmEmail') {
      if (value !== this.state.email) {
        this.setState({emailConfirmError: true});
      } else {
        this.setState({emailConfirmError: false});
      }
    }

    if (name === 'password') {
      if (value.length && !value.match(passwordRegex)) {
        this.setState({passwordErrorText: passwordHelper, passwordError: true});
      } else {
        this.setState({passwordError: false});
      }
      if (value.length && value !== this.state.confirmPassword) {
        this.setState({passwordConfirmError: true});
      } else {
        this.setState({passwordConfirmError: false});
      }
    }

    if (name === 'confirmPassword') {
      if (this.state.password.length && value !== this.state.password) {
        this.setState({passwordConfirmError: true});
      } else {
        this.setState({passwordConfirmError: false});
      }
    }

    if (name === 'favoriteTeam') {
      if (name === 'favoriteTeam' && !value) {
        this.setState({favoriteTeamErrorText: favoriteTeamHelper, favoriteTeamError: true});
      } else if (name === 'favoriteTeam' && value) {
        this.setState({favoriteTeamErrorText: '', favoriteTeamError: false});
      }
    }
  };
  
  updateInfo = () => {
    const { email, confirmEmail, password, confirmPassword, name, description, favoriteTeam } = this.state;
    const accountObj = {
      email: email,
      confirmEmail: email,
      password: password,
      favoriteTeam: favoriteTeam,
      name: name,
      description: description
    };
    if ((!password.length || (password.length && password.match(passwordRegex))) && 
      password === confirmPassword &&
      email === confirmEmail &&
      favoriteTeam) {
      API.updateAccountInfo(accountObj)
        .then((response) => {
          if(response.data.message) {
            this.setState({snackbarMessage: response.data.message, snackbarOpen: true});
          } else {
            this.setState({snackbarMessage: 'Information updated successfully.', snackbarOpen: true, password: '', confirmPassword: ''});
          }
        })
        .catch((err) => {
          console.log('Error updating account info.', err);
        });
    }
  }
  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <div id="page-content">
        <Row>
          <Col md={12}>
            <Snackbar
              open={this.state.snackbarOpen}
              onClose={this.handleSnackbarClose}
              SnackbarContentProps={{
                'aria-describedby': 'accountInfo',
              }}
              message={<span id="accountInfo">{this.state.snackbarMessage}</span>}
            />
            <Paper className={classes.paper}>
              <Typography variant="display1" gutterBottom align="center">
               Account Information
              </Typography> 
              <form
                style={{width: '100%'}}
                onSubmit={(e) => {
                  e.preventDefault();
                  return this.updateInfo();
                }}
              >
                <Row>
                  <Col md={2}>
                    <Typography variant="subheading" className="bold">
                      Your Avatar
                    </Typography>
                  </Col>
                  <Col md={9}/>
                </Row>
                <Row className={classes.gravatarInfo}>
                  <Col md={2}>
                    <img 
                      alt={this.state.username}
                      src={this.state.gravatar}
                      className={`img-fluid ${classes.avatar}`}/>
                  </Col>
                  <Col md={10}>
                    <Typography variant="subheading">
                      Avatars are maintained by <a href="https://www.gravatar.com" target="_blank">GRAVATAR</a>, a free service that allows you to associate an image with your email address. If you wish to associate an image with the email address you use here (or on any other site that uses Gravatars), visit <a href="https://www.gravatar.com" target="_blank">https://www.gravatar.com</a>.
                    </Typography>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>

                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Typography variant="subheading" className="bold">Update Email Address</Typography>
                    <TextField
                      fullWidth 
                      id="email-input"
                      label="Enter Your Email Address"
                      name="email"
                      type="email"
                      margin="normal"
                      onChange={this.handleInputChange.bind(this)}
                      required={true}
                      value={this.state.email}
                    />
                    <TextField
                      fullWidth 
                      id="email-confirm"
                      label="Confirm Your Email Address"
                      name="confirmEmail"
                      type="email"
                      margin="normal"
                      onChange={this.handleInputChange.bind(this)}
                      required={true}
                      error={this.state.emailConfirmError}
                      value={this.state.confirmEmail}
                      helperText={this.state.confirmEmailText}
                    /><br/><br/>

                    <Typography variant="subheading" className="bold">Update Password</Typography>

                    <TextField
                      fullWidth 
                      id="password-input"
                      label="Create a New Password (optional)"
                      name="password"
                      type="password"
                      margin="normal"
                      error={this.state.passwordError}
                      helperText= {this.state.passwordErrorText}
                      onChange={this.handleInputChange.bind(this)}
                      value={this.state.password}
                    />
                    <TextField
                      fullWidth 
                      id="password-confirm"
                      label="Confirm New Password"
                      inputRef={(input) => this.passwordElem = input}
                      name="confirmPassword"
                      type="password"
                      margin="normal"
                      error={this.state.passwordConfirmError}
                      helperText={this.state.confirmPasswordText}
                      onChange={this.handleInputChange.bind(this)}
                      value={this.state.confirmPassword}
                    />
                  </Col>
                  <Col md={6}>
                    <Typography variant="subheading" className="bold">Personal Info</Typography>
                    <TextField
                      fullWidth
                      name="name"
                      margin="normal"
                      value={this.state.name}
                      label="Display Name (optional)"
                      onChange={this.handleInputChange.bind(this)}
                    />
                    <TextField
                      fullWidth
                      name="description"
                      rows={1}
                      rowsMax={6}
                      margin="normal"
                      multiline={true}
                      value={this.state.description}
                      label="Tell Everyone a Bit about Yourself"
                      onChange={this.handleInputChange.bind(this)}
                    />
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
                  </Col>
                </Row>
                <Row>
                  <Col md={12} style={{textAlign: 'center'}}>                 
                    <Button type="submit" variant="raised" color="primary" className={classes.button}>
              Update Account Information
                    </Button>
                  </Col>
                </Row>
              </form>
            </Paper>
          </Col>
        </Row>
        <LoadingModal open={this.state.modalOpen} />
      </div>
    );
  }
}

export default withUser(withRouter(withStyles(styles)(AccountPage)));