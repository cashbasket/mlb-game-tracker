import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import Grid from 'material-ui/Grid';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import API from './utils/api';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

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
    rest.loggedIn ? (
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
      isLoggedIn: false
    };
    this.logOut = this.logOut.bind(this);
    this.authenticate = this.authenticate.bind(this);
  }

  authenticate = (fn) => {
    API.authenticate().then((res) => {
      console.log(res.data);
      if (res.data.authenticated) {
        console.log('authenticated');
        this.setState({ isLoggedIn: true });
        if (typeof fn === 'function') {
          fn();
        }
      }
    }).catch((err) => {
      console.log('Error fetching authorized user.');
    });
  }

  logOut = (fn) => {
    API.logout()
      .then((res) => {
        if (res.status === 200) {
          this.setState({ isLoggedIn: false });
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
    return (
      <MuiThemeProvider theme={theme}>
        <Grid container spacing={0} justify="center" alignItems="center">
          <Grid item md={9} sm={12} xs={12}>
            <Router>
              <div>
                <Navbar loggedIn={this.state.isLoggedIn} logOut={this.logOut} />
                <main>
                  {/* <ul>
                    <li><Link to="/public">Public Page</Link></li>
                    <li><Link to="/protected">Protected Page</Link></li>
                    <li><Link to="/more-protected">Another Protected Page</Link></li>
                    <li><Link to="/register">Register a New User</Link></li>
                  </ul> */}
                  <Route exact path="/public" component={Public}/>
                  {/* <Route path="/users/:username" component={Profile}/> */}
                  <PropsRoute exact path="/login" component={Login} authenticate={this.authenticate}/>
                  <PropsRoute exact path="/register" component={Register} authenticate={this.authenticate}/>
                  <PrivateRoute exact path="/protected" component={Protected} loggedIn={this.state.isLoggedIn}/>
                  <PrivateRoute exact path="/more-protected" component={MoreProtected} loggedIn={this.state.isLoggedIn}/>
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

export default App;
