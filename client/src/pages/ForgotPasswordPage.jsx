import React from 'react';
import API from '../utils/api';
import { Row, Col } from 'react-flexbox-grid';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { withUser } from '../services/withUser';
import { withRouter } from 'react-router-dom';
import LoadingModal from '../components/LoadingModal';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 4
  },
  header: {
    marginBottom: theme.spacing.unit
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

class ForgotPasswordPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      modalOpen: false
    };
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };
  
  handleFormSubmit = () => {
    this.setState({modalOpen: true}, () => {
      API.forgotPassword(this.state.email)
        .then(() => {
          this.setState({email: '', modalOpen: false});
          document.getElementById('sentInfo').classList.remove('hidden');
        })
        .catch((err) => {
          console.log('Error sending email.', err);
        });
    }); 
  }

  render() {
    const { classes } = this.props;
    return (
      <div id="page-content">
        <Row>
          <Col md={6} mdOffset={3}>
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
                 
                    <Typography variant="display1" className={classes.header} align="center">Forget Your Password?</Typography>
                    <Typography>
                  Bummer. We can help, though! Just enter your email address below, and hit "Send" to have a password-reset email sent to you.
                    </Typography>
                    <div id="sentInfo" className={`${classes.messageDiv} hidden`}>
                      <Typography className={classes.message} variant="subheading">
                Thanks! If the email address you just entered has an account associated with it, we sent an email to that address with instructions on how to reset your password.
                      </Typography>
                    </div>
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
                  </Col>
                </Row>
                <Row>
                  <Col md={12} style={{textAlign: 'center'}}>                 
                    <Button type="submit" variant="raised" color="primary" className={classes.button}>
              Send
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

export default withUser(withRouter(withStyles(styles)(ForgotPasswordPage)));