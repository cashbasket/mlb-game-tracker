import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withRouter } from 'react-router-dom';
import { withUser } from '../services/withUser';
import moment from 'moment';
import Button from 'material-ui/Button';
import CheckBox from 'material-ui-icons/CheckBox';
import CheckBoxOutline from 'material-ui-icons/CheckBoxOutlineBlank';
import API from '../utils/api';

const styles = theme => ({
  leftIcon: {
    marginRight: theme.spacing.unit / 3,
  },
  iconSmall: {
    fontSize: 20,
  }
});

class AttendButton extends React.Component {
  render() {
    const { classes, user, gameId, gameDate, gameTime } = this.props;
    const gameDateTime = moment(`${gameDate} ${gameTime}`, 'YYYY-MM-DD HH:mm:ss');
    return (
      <Fragment>
        {user && <Button variant={this.props.variant} color={this.props.color} className={this.props.className} size={this.props.size ? this.props.size : ''} onClick={() => this.props.isAttending === false ? this.props.addAttendance(user.id, gameId) : this.props.deleteAttendance(gameId, user.id)}>
          {this.props.isAttending ? (
            <CheckBox className={classes.leftIcon}/>
          ) : (
            <CheckBoxOutline className={classes.leftIcon}/>
          )}
          {!this.props.isAttending ? (
            <Fragment>
              {moment().diff(gameDateTime, 'hours') > -1 && moment().diff(gameDateTime, 'hours') < 3 ? 'Are you at this game?' : (moment().diff(gameDateTime, 'hours') >= 3 ? 'Did you go to this game?' : 'Are you going to this game?')}
            </Fragment>
          ) : (
            <Fragment>
              {moment().diff(gameDateTime, 'hours') > -1 && moment().diff(gameDateTime, 'hours') < 3 ? 'I\'m at this game' : (moment().diff(gameDateTime, 'hours') >= 3 ? 'I went to this game' : 'I\'m going to this game')}
            </Fragment>
          )
          }
        </Button>
        }
      </Fragment>
    );
  }
}

export default withUser(withStyles(styles)(AttendButton));
