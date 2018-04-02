import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { withUser } from '../services/withUser';
import Button from 'material-ui/Button';

const styles = theme => ({
  root: {
    backgroundColor: '#bfcbd1',
    border: '1px solid #718792',
    padding: theme.spacing.unit,
    margin: 0,
    maxWidth: '100%'
  },
  heading: {
    display: 'flex'
  },
  teamName: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 15,
    textAlign: 'center'
  },
  infoDiv: {
    marginBottom: theme.spacing.unit * 2,
    textAlign: 'center'
  },
  bold: {
    fontWeight: 700
  },
  logo: {
    maxWidth: 200
  }
});

class TeamInfo extends React.Component {
  render() {
    const { classes, data } = this.props;
    return (
      <Paper className={classes.root} id="teamInfo">
        <Row className={classes.heading}>
          <Col md={12}>
            {data.logo && (
              <div>
                {data.id ? (
                  <Link to={`/team/${data.id}`} className="plainLink text-center">
                    <img src={`/img/logos/${data.logo}`} className="img-fluid team-info-logo"/>
                  </Link>
                ) : (
                  <img src={`/img/logos/${data.logo}`} className="img-fluid team-info-logo"/>
                )}
              </div>
            )}
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            {data.id ? (
              <div className={classes.infoDiv}>
                <Button variant="raised" size="small" color="primary" component={Link} to={`/team/${data.id}`} className={classes.button}>
                View Schedule
                </Button>
              </div>
            ) : (
              <Fragment>
                <div className={classes.infoDiv}>
                  <Typography variant="subheading" className={classes.bold}>Established:</Typography>
                  <Typography>{data.established}</Typography>
                </div>
                <div className={classes.infoDiv}>
                  <Typography variant="subheading" className={classes.bold}>League:</Typography>
                  <Typography>{data.league}</Typography>
                </div>
                <div className={classes.infoDiv}>
                  <Typography variant="subheading" className={classes.bold}>Division:</Typography>
                  <Typography>{data.division}</Typography>
                </div>
                <div className={classes.infoDiv}>
                  <Typography variant="subheading" className={classes.bold}>Manager:</Typography>
                  <Typography>{data.manager}</Typography>
                </div>
              </Fragment>
            )}
          </Col>
        </Row>
      </Paper>
    );
  }
}

export default withUser(withRouter(withStyles(styles)(TeamInfo)));

