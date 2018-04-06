import React from 'react';
import API from '../utils/api';
import { Row, Col } from 'react-flexbox-grid';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import { Redirect } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Snackbar from 'material-ui/Snackbar';
import LoginForm from '../components/LoginForm';
import { withUser } from '../services/withUser';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  button: {
    marginTop: theme.spacing.unit * 3
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

class LoginPage extends React.Component {
  render() { 
    return (
      <Row>
        <Col md/>
        <Col md={6}>
          <LoginForm authenticate={this.props.authenticate}/>
        </Col>
        <Col md/>
      </Row>
    );
  }
}

export default withUser(withRouter(withStyles(styles)(LoginPage)));