import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TeamPage from './pages/TeamPage';
import GamePage from './pages/GamePage';
import ProfilePage from './pages/ProfilePage';
import AccountPage from './pages/AccountPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NoMatch from './pages/NoMatch';
import API from './utils/api';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { withUser, update } from './services/withUser';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';

// Defines the colors, fonts, etc. that the app will use.
const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#f05545',
      main: '#b71c1c',
      dark: '#7f0000',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#62727b',
      main: '#37474f',
      dark: '#102027',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: '\'Roboto\', sans-serif',
    fontSize: 14,
    title: {
      fontFamily: '\'Playball\', cursive',
      fontSize: 40
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
    this.state = {
      auth: ''
    };
    this.authenticate = this.authenticate.bind(this);
  }

  authenticate = (fn) => {
    API.authenticate().then((res) => {
      if (res.data.authenticated) {
        update(res.data.user);
        this.setState({auth: true},
          () => {
            if (typeof fn === 'function') {
              fn();
            }
          });
      } else {
        this.setState({auth: false});
      }
    }).catch((err) => {
      update(null);
      console.log(err);
    });
  }

  componentDidMount = () => {
    this.authenticate();
  }

  render() {
    // don't render until auth state has been set
    if (this.state.auth === '')
      return null;

    user = this.props.user;
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <MuiThemeProvider theme={theme}>
          <Router> 
            <Fragment>
              <Navbar/>
              <main> 
                <Grid>
                  <Row style={{paddingLeft: 15, paddingRight: 15}}>
                    <Col sm={12}>
                      <Switch>
                        <PropsRoute exact path="/" component={LandingPage} authenticate={this.authenticate} />
                        <Route exact path="/team/:teamId" component={TeamPage} />
                        <PrivateRoute exact path="/game/:gameId" component={GamePage} />
                        <PropsRoute exact path="/login" component={LoginPage} authenticate={this.authenticate} />
                        <PropsRoute exact path="/register" component={RegisterPage} authenticate={this.authenticate} />
                        <PrivateRoute exact path="/user/:username" component={ProfilePage} />
                        <PrivateRoute exact path="/account" component={AccountPage} />
                        <Route exact path="/forgot" component={ForgotPasswordPage} />
                        <Route exact path="/reset/:token?" component={ResetPasswordPage} />
                        <Route component={NoMatch} />
                      </Switch>
                    </Col>
                  </Row>
                </Grid>
              </main>
            </Fragment>
          </Router>
        </MuiThemeProvider>
      </MuiPickersUtilsProvider>
    );
  }
}

export default withUser(App);
