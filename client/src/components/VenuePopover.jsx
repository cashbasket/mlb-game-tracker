import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Popover from 'material-ui/Popover';

const styles = theme => ({
  header: {
    fontSize: 18,
    color: theme.palette.primary.main,
    textDecoration: 'underline',
    cursor: 'pointer'
  },
  typography: {
    padding: theme.spacing.unit,
    color: '#fff'
  },
  paper: {
    padding: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.dark
  },
  popover: {
    pointerEvents: 'none',
  },
  popperClose: {
    pointerEvents: 'none',
  },
});

class VenuePopover extends React.Component {
  state = {
    anchorEl: null
  };

  handlePopoverOpen = event => {
    this.setState({ anchorEl: event.target });
  };

  handlePopoverClose = () => {
    this.setState({ anchorEl: null });
  };

  anchorEl = null;

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = !!anchorEl;

    return (
      <div className="wrapper">
        <Typography className={`text-center ${classes.header}`} onMouseOver={this.handlePopoverOpen} onMouseOut={this.handlePopoverClose}>
          {this.props.venueName}
        </Typography>
        <Popover
          className={classes.popover}
          classes={{
            paper: classes.paper,
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          onClose={this.handlePopoverClose}
          disableRestoreFocus
        >
          <Typography className={classes.typography}>
            <strong>Capacity:</strong> {this.props.capacity}<br/>
            <strong>Type:</strong> {this.props.type}<br/>
            <strong>Surface:</strong> {this.props.surface}<br/>
            <strong>Dimensions:</strong> {this.props.dimensions}
          </Typography>
        </Popover>
      </div>
    );
  }
}

VenuePopover.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(VenuePopover);