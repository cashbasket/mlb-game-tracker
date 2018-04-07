import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import { withRouter } from 'react-router-dom';
import MenuIcon from 'material-ui-icons/Menu';
import Button from 'material-ui/Button';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Avatar from 'material-ui/Avatar';
import Menu, { MenuItem } from 'material-ui/Menu';
import { withUser, update } from '../services/withUser';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemText } from 'material-ui/List';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import TeamMenu from '../components/TeamMenu';
import Divider from 'material-ui/Divider';
import TeamList from '../components/TeamList';
import API from '../utils/api';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 10,
  },
  list: {
    width: 250,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 25,
    marginBottom: 10,
    padding: '0 8px',
  }
};

class Navbar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      anchorEl: null,
      drawerOpen: false
    };
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleLogout = () => {
    this.handleClose();
    this.logOut(() => {
      this.props.history.push('/');
    });
  };

  toggleDrawer = (open) => () => {
    this.setState({
      drawerOpen: open,
    });
  };

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

  render() {
    const { classes, user } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div>
        {(this.props.location.pathname.indexOf('/team/') < 0 || this.props.forceDisplay) && (
          <div className={classes.root}>
            <AppBar position="fixed">
              <Grid>
                <Row>
                  <Col sm>
                    <Toolbar>
                      <IconButton id="menuButton" className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleDrawer(true)}>
                        <MenuIcon />
                      </IconButton>
                      <Typography variant="title" color="inherit" className={classes.flex}>
                        <i class="fas fa-baseball-ball"></i> Went Yard
                      </Typography>
                      <div id="teamMenu">
                        <TeamMenu handleTeamChange={this.props.handleTeamChange ? this.props.handleTeamChange : false}/>
                      </div>
                      {user ? (
                        <div id="userMenu" className={classes.userMenu}>
                      
                          <IconButton
                            aria-owns={open ? 'menu-appbar' : null}
                            aria-haspopup="true"
                            onClick={this.handleMenu}
                            color="inherit"
                          >
                            <Avatar
                              alt={this.props.user.username}
                              src={this.props.user.gravatar}
                            />
                          </IconButton>
                          <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                            }}
                            open={open}
                            onClose={this.handleClose}
                          >
                            <MenuItem component={Link} to="/dashboard" onClick={this.handleClose}>Dashboard</MenuItem>
                            <MenuItem component={Link} to={`/user/${user.username}`} onClick={this.handleClose}>My Profile</MenuItem>
                            <MenuItem component={Link} to="/account" onClick={this.handleClose}>Account</MenuItem>
                            <MenuItem onClick={this.handleLogout}>Log Out</MenuItem>
                          </Menu>
                        </div>
                      ) : (
                        <div id="userMenu">
                          <Button component="a" href="/register" style={{color: '#FFF'}}>Sign Up</Button>
                          <Button component="a" href="/login" style={{color: '#FFF'}}>Log In</Button>
                        </div>
                      )}
                    </Toolbar>
                  </Col>
                </Row>
              </Grid>
            </AppBar>
            <Drawer open={this.state.drawerOpen} onClose={this.toggleDrawer(false)}>
              <div className={classes.drawerHeader}>
                <IconButton onClick={this.toggleDrawer(false)}>
                  <ChevronLeftIcon />
                </IconButton>
              </div>
              <div
                tabIndex={0}
                role="button"
                onClick={this.toggleDrawer(false)}
                onKeyDown={this.toggleDrawer(false)}
              >
                <div className={classes.list}>
                  <List component="nav">
                    {user ? (
                      <div>
                        <ListItem button component={Link} to="/dashboard"> 
                          <ListItemText primary="Dashboard" />
                        </ListItem>
                        <ListItem button component={Link} to={`/user/${user.username}`}> 
                          <ListItemText primary="My Profile" />
                        </ListItem>
                        <ListItem button component={Link} to="/account">
                          <ListItemText primary="Account" />
                        </ListItem>
                        <ListItem button onClick={this.handleLogout}>
                          <ListItemText primary="Log Out" />
                        </ListItem>
                      </div>
                    ) : ( 
                      <div>
                        <ListItem button component={Link} to="/login">
                          <ListItemText primary="Log In" />
                        </ListItem>
                        <ListItem button component={Link} to="/register">
                          <ListItemText primary="Sign Up" />
                        </ListItem>
                      </div>
                    )}
                  </List>
                  <Divider/>
                  <TeamList handleTeamChange={this.props.handleTeamChange ? this.props.handleTeamChange : false}/>
                </div>
              </div>
            </Drawer>
          </div>
        )}
      </div>
    );
  }
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withUser(withRouter(withStyles(styles)(Navbar)));
