import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { withUser } from '../services/withUser';
import { withRouter, Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center'
  }
});

class NoMatch extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <Row>
        <Col md/>
        <Col md={8}>
          <Paper className={classes.paper}>
            <img src="https://media.giphy.com/media/cj2vxgPiADd5e/giphy.gif" alt="404 Error" className="img-404 img-fluid" />
            <Typography variant="display3">Strike Three!</Typography>
            <Typography variant="headline">(i.e. 404 Error)</Typography>
            <Typography variant="subheading">
            It looks like you're trying to access a page that doesn't exist :-/  We recommend checking out one of our pages that actually DO exist, though; they're nice pages.</Typography>
            <br/>
            <Typography className="bold">
              For instance, the <Link to="/team/116">Cleveland Indians page</Link> is cool.  Just sayin'.
            </Typography>
          </Paper>
        </Col>
        <Col md/>
      </Row>
    );
  }
}

export default withUser(withRouter(withStyles(styles)(NoMatch)));
