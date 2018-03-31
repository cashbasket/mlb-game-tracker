import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import { withRouter } from 'react-router-dom';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { withUser } from '../services/withUser';
import API from '../utils/api';

const styles = theme => ({
  root: {
    backgroundColor: '#bfcbd1',
    border: '1px solid #718792',
    padding: '0 15px',
  },
  heading: {
    display: 'flex'
  },
  teamName: {
    fontSize: 30,
    fontWeight: 700,
    marginBottom: 15,
    textAlign: 'center'
  },
  infoDiv: {
    marginBottom: 30,
    textAlign: 'center'
  },
  bold: {
    fontWeight: 700
  },
  logo: {
    height: 200,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  }
});

class Game extends React.Component {
  componentDidMount = () => {
    this.props.getTeamInfo();
  };

  render() {
    const { classes, theme } = this.props;
    return (
      <Paper className={classes.root} id="teamInfo">
        <Grid container justify="center" direction="column" className={classes.heading}>
          <img src={`/img/logos/${this.props.state.teamLogo}`} className={classes.logo}/>
          <Typography variant="display1" className={classes.teamName}>{this.props.state.teamCity} {this.props.state.teamName}</Typography>
        </Grid>
        <Grid container direction="column">
          <Grid item md={12}>
            <div className={classes.infoDiv}>
              <Typography variant="subheading" className={classes.bold}>Established:</Typography>
              <Typography>{this.props.state.teamEstablished}</Typography>
            </div>
            <div className={classes.infoDiv}>
              <Typography variant="subheading" className={classes.bold}>League:</Typography>
              <Typography>{this.props.state.teamLeague}</Typography>
            </div>
            <div className={classes.infoDiv}>
              <Typography variant="subheading" className={classes.bold}>Division:</Typography>
              <Typography>{this.props.state.teamDivision}</Typography>
            </div>
            <div className={classes.infoDiv}>
              <Typography variant="subheading" className={classes.bold}>Stadium:</Typography>
              <Typography>{this.props.state.teamVenueName}</Typography>
            </div>
            <div className={classes.infoDiv}>
              <Typography variant="subheading" className={classes.bold}>Manager:</Typography>
              <Typography>{this.props.state.teamManager}</Typography>
            </div>
          </Grid>
        </Grid>
      </Paper>
    );}
}

export default withUser(withRouter(withStyles(styles)(Game)));

