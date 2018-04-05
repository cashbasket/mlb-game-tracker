import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TeamPage from './pages/TeamPage';
import GamePage from './pages/GamePage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AccountPage from './pages/AccountPage';
import API from './utils/api';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { withUser, update } from './services/withUser';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';

// Defines the colors, fonts, etc. that the app will use.
const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#4f5b62',
      main: '#263238',
      dark: '#000a12',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ffffff',
      main: '#cfd8dc',
      dark: '#9ea7aa',
      contrastText: '#000',
    },
  },
  typography: {
    fontFamily: '\'Roboto\', sans-serif',
    fontSize: 14,
    title: {
      fontFamily: '\'Abril Fatface\', cursive',
      fontSize: 30,
      fontWeight: 700
    },
    headline: {
      textTransform: 'uppercase',
      marginBottom: 10
    }
  }
});

let user;

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
};

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderMergedProps(component, routeProps, rest);
    }}/>
  );
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    user ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
);

class App extends Component {
  constructor() {
    super();
    this.authenticate = this.authenticate.bind(this);
  }

  authenticate = (fn) => {
    API.authenticate().then((res) => {
      if (res.data.authenticated) {
        update(res.data.user);
        if (typeof fn === 'function') {
          fn();
        }
      }
    }).catch((err) => {
      update(null);
      console.log('Error fetching authorized user.');
    });
  }

  componentDidMount = () => {
    this.authenticate();
  }

  render() {
    user = this.props.user;
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <MuiThemeProvider theme={theme}>
          <Router>
            <div>
              <Navbar/>
              <main> 
                <Grid>
                  <Row style={{paddingLeft: 15, paddingRight: 15}}>
                    <Col sm={12}>
                      <Route path="/team/:teamId" component={TeamPage} />
                      <PrivateRoute path="/game/:gameId" component={GamePage} />
                      <PropsRoute exact path="/login" component={LoginPage} authenticate={this.authenticate} />
                      <PropsRoute exact path="/register" component={RegisterPage} authenticate={this.authenticate} />
                      <PrivateRoute path="/dashboard" component={DashboardPage} />
                      <PrivateRoute path="/user/:username" component={ProfilePage} />
                      <PrivateRoute path="/account" component={AccountPage} />
                    </Col>
                  </Row>
                </Grid>
              </main>
            </div>
          </Router>
        </MuiThemeProvider>
      </MuiPickersUtilsProvider>
    );
  }
}

export default withUser(App);
