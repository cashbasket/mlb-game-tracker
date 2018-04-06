import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Modal from 'material-ui/Modal';
import { CircularProgress } from 'material-ui/Progress';

const styles = theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    position: 'absolute',
    textAlign: 'center',
    width: theme.spacing.unit * 30,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  }
});

class LoadingModal extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.props.open}
          className={classes.modal}
        >
          <div className={classes.paper}>
            <CircularProgress/>
            <Typography variant="subheading" className="bold" id="simple-modal-description">
              Loading
            </Typography>
          </div>
        </Modal>
      </div>
    );
  }
}
LoadingModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoadingModal);