import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { Link } from 'react-router-dom';
import List, { ListItem, ListItemText } from 'material-ui/List';
import API from '../utils/api';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  summary: {
    paddingLeft: 15
  },
  teamsHead: {
    fontWeight: 'bold', 
    marginTop: 15,
    paddingLeft: 15
  }
});

class TeamList extends React.Component {
  state = {
    mlbTeams: []
  };

  componentDidMount = () => {
    API.getAllTeams().then((res) => {
      const mlbTeams = [];
      res.data.teams.map(team => (
        mlbTeams.push({
          id: team.id,
          name: `${team.city} ${team.name}`
        })
      ));
      this.setState({mlbTeams: mlbTeams});
    });
  };
  

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="subheading" className={classes.teamsHead}>Choose a team:</Typography>
        <List>
          {this.state.mlbTeams.map(team => (
            <ListItem button key={team.id} component={Link} to={`/team/${team.id}`}> 
              <ListItemText primary={team.name} />
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}

TeamList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TeamList);
