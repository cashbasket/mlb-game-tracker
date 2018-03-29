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
import Grid from 'material-ui/Grid';
import AccountCircle from 'material-ui-icons/AccountCircle';
import Menu, { MenuItem } from 'material-ui/Menu';
import { withUser } from '../services/withUser';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  list: {
    width: 250,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
  },
  userMenu: {
    display: 'none'
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
    this.props.logOut(() => {
      this.props.history.push('/');
    });
  };

  toggleDrawer = (open) => () => {
    this.setState({
      drawerOpen: open,
    });
  };

  render() {
    const { classes, user } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Grid container spacing={0} justify="center">
            <Grid item md={9} sm={12} xs={12}>
              <Toolbar>
                <IconButton id="menuButton" className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleDrawer(true)}>
                  <MenuIcon />
                </IconButton>
                <Typography variant="title" color="inherit" className={classes.flex}>
              MLB Game Tracker
                </Typography>
                {user && (
                  <div id="userMenu" className={classes.userMenu}>
                    <IconButton
                      aria-owns={open ? 'menu-appbar' : null}
                      aria-haspopup="true"
                      onClick={this.handleMenu}
                      color="inherit"
                    >
                      <AccountCircle />
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
                      <MenuItem onClick={this.handleClose}>My Profile</MenuItem>
                      <MenuItem onClick={this.handleClose}>My Account</MenuItem>
                      <MenuItem onClick={this.handleLogout}>Log Out</MenuItem>
                    </Menu>
                  </div>
                )}
              </Toolbar>
            </Grid>
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
                    <ListItem button component={Link} to={`/user/${user.username}`}> 
                      <ListItemText primary="My Profile" />
                    </ListItem>
                    <ListItem button component={Link} to={`/user/${user.username}/account`}>
                      <ListItemText primary="My Account" />
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
                      <ListItemText primary="Register" />
                    </ListItem>
                  </div>
                )}
              </List>
            </div>
          </div>
        </Drawer>
      </div>
    );
  }
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withUser(withRouter(withStyles(styles)(Navbar)));
