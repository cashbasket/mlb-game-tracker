import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';
import Grid from 'material-ui/Grid';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import API from './utils/api';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { withUser, update } from './services/withUser';

// Eefines the colors Material-UI will use as the theme.
const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#718792',
      main: '#455a64',
      dark: '#1c313a',
      contrastText: '#fff',
    },
    secondary: {
      light: '#484848',
      main: '#212121',
      dark: '#000000',
      contrastText: '#000',
    },
  },
});

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
    rest.user ? (
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
    this.logOut = this.logOut.bind(this);
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

  logOut = (fn) => {
    API.logout()
      .then((res) => {
        if (res.status === 200) {
          update(null);
          if (typeof fn === 'function') {
            fn();
          }
        }
      }).catch((err) => {
        console.log('Error logging out user.');
      });
  }

  componentDidMount = () => {
    this.authenticate();
  }

  render() {
    const { user } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <Grid container spacing={0} justify="center" alignItems="center">
          <Grid item md={9} sm={12} xs={12}>
            <Router>
              <div>
                <Navbar logOut={this.logOut} />
                <main>
                  {/* <ul>
                    <li><Link to="/public">Public Page</Link></li>
                    <li><Link to="/protected">Protected Page</Link></li>
                    <li><Link to="/more-protected">Another Protected Page</Link></li>
                    <li><Link to="/register">Register a New User</Link></li>
                  </ul> */}
                  <Route exact path="/public" component={Public}/>
                  {/* <Route path="/users/:username" component={Profile}/> */}
                  <PropsRoute exact path="/login" component={Login} authenticate={this.authenticate} />
                  <PropsRoute exact path="/register" component={Register} authenticate={this.authenticate} />
                  <PrivateRoute exact path="/protected" component={Protected} user={user}/>
                  <PrivateRoute exact path="/more-protected" component={MoreProtected} user={user}/>
                </main>
              </div>
            </Router>
          </Grid>
        </Grid>
      </MuiThemeProvider>
    );
  }
}

const Public = () => <h3>Public</h3>;
const Protected = () => <h3>Protected</h3>;
const MoreProtected = () => <h3>More Protected</h3>;

export default withUser(App);
