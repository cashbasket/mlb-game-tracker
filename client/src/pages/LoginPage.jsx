import React from 'react';
import API from '../utils/api';
import { Row, Col } from 'react-flexbox-grid';
import LoginForm from '../components/LoginForm';
import { withUser } from '../services/withUser';
import { withRouter } from 'react-router-dom';

class LoginPage extends React.Component {
  render() { 
    return (
      <Row>
        <Col md={6} mdOffset={3}>
          <LoginForm authenticate={this.props.authenticate}/>
        </Col>
      </Row>
    );
  }
}

export default withUser(withRouter(LoginPage));