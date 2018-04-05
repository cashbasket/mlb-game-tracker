import React from 'react';
import API from '../utils/api';
import { Row, Col } from 'react-flexbox-grid';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { withUser } from '../services/withUser';
import { withRouter, Redirect } from 'react-router-dom';
import LoadingModal from '../components/LoadingModal';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 4
  },
  message: {
    color: theme.palette.primary.contrastText
  },
  messageDiv: {
    backgroundColor: '#579fc4',
    border: '1px solid #000',
    color: theme.palette.primary.contrastText,
    padding: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    fontSize: 16
  },
  button: {
    marginTop: theme.spacing.unit * 2
  }  
});


const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
const passwordHelper = 'Valid passwords must be between 8 and 16 chracters, and include at least one upper case letter, one lower case letter, and one numeric digit.';
const confirmPasswordHelper = 'Password fields must match!';


class ResetPassworPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      token: this.props.match.params.token,
      password: '',
      confirmPassword: '',
      passwordError: false,
      confirmPasswordError: false,
      confirmPasswordText: confirmPasswordHelper,
      passwordErrorText: passwordHelper,
      validToken: true,
      success: false,
      modalOpen: true
    };
  }

  componentDidMount = () => {
    API.checkToken(this.props.match.params.token)
      .then((res) => {
        if(!res.data.user)
          this.setState({validToken: false});
        else
          this.setState({modalOpen: false});
      })
      .catch((err) => {
        console.log('Error checking token');
      });
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });

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
  };
  
  handleFormSubmit = () => {
    this.setState({modalOpen: true}, () => {
      API.resetPassword(this.state.token, this.state.password)
        .then(() => {
          this.setState({success: true, modalOpen: false});
        })
        .catch((err) => {
          console.log('Error resetting password.', err);
        });
    }); 
  }

  render() {
    const { classes } = this.props;
    if (this.state.success) {
      return (
        <Redirect to="/login"/>
      );
    }
    if (!this.props.match.params.token || this.state.validToken === false) {
      return (
        <Redirect to="/forgot"/>
      );
    }
    return (
      <div id="page-content">
        <Row>
          <Col md />
          <Col md={8}>
            <Paper className={classes.paper}>
              <form
                style={{width: '100%'}}
                onSubmit={(e) => {
                  e.preventDefault();
                  return this.handleFormSubmit();
                }}
              >
                <Row>
                  <Col md={12}>
                 
                    <Typography variant="headline" align="center">Reset Password</Typography>
                    <Typography variant="subheading">
                  Fill out the fields below to reset your password. Once your password is successfully reset, you will be redirected to the login page, where you can log in with your new password.
                    </Typography>
                    <TextField
                      fullWidth 
                      id="password-input"
                      label="Create a New Password"
                      name="password"
                      type="password"
                      margin="normal"
                      error={this.state.passwordError}
                      helperText= {this.state.passwordErrorText}
                      onChange={this.handleInputChange.bind(this)}
                      value={this.state.password}
                      required={true}
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
                      required={true}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md={12} style={{textAlign: 'center'}}>                 
                    <Button type="submit" variant="raised" color="primary" className={classes.button}>
              Submit
                    </Button>
                  </Col>
                </Row>
              </form>
            </Paper>
          </Col>
          <Col md />
        </Row>
        <LoadingModal open={this.state.modalOpen} />
      </div>
    );
  }
}

export default withUser(withRouter(withStyles(styles)(ResetPassworPage)));