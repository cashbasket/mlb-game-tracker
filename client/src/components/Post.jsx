import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { withUser } from '../services/withUser';
import moment from 'moment';
import Button from 'material-ui/Button';
import Delete from 'material-ui-icons/DeleteForever';
import Divider from'material-ui/Divider';
import API from '../utils/api';
import Avatar from 'material-ui/Avatar';
import Check from 'material-ui-icons/Check';

const styles = theme => ({
  avatar: {
    width: 100,
    height: 100,
    border: `1px solid ${theme.palette.secondary.dark}`
  },
  buttonText: theme.typography.button,
  attending: {
    color: theme.palette.primary.main
  },
  post: {
    padding: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  postText: {
    fontSize: 16
  },
  button: {
    marginTop: theme.spacing.unit
  },
  dashUserLink: {
    borderBottom: 'none'
  }
});

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameDate: '',
      gameTitle: ''
    };
  }
  htmlDecode = (input) => {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.innerHTML;
  }

  deletePost = (postId, isDashboard = false) => {
    API.deletePost(postId)
      .then(() => {
        this.props.send && this.props.send();
        if(isDashboard) {
          this.props.getPosts();
        }
      });
  }

  render() {
    const { classes, postData, dashboard, gameDate } = this.props;
    const text = postData.postText;
    return (
      <li>
        <div>
          {!dashboard ? (
            <Paper className={classes.post}>     
              <Row>
                <Col md={2}>
                  <Link to={`/user/${postData.user.username}`}>
                    <Avatar
                      alt={postData.user.username}
                      src={postData.user.gravatar}
                      className={`img-fluid ${classes.avatar}`}
                    />
                  </Link>
                </Col>
                <Col md={10}>
                  <Typography variant="subheading">
                    <Link to={`/user/${postData.user.username}`}>
                      <strong>{postData.user.name ? postData.user.name : postData.user.username}</strong>
                    </Link>
                  </Typography>
                  {postData.user.attendances.length > 0 && (
                    <Typography variant="subheading" className={`${classes.attending} ${classes.buttonText}`}>
                      {moment().diff(gameDate, 'hours') > -1 && moment().diff(gameDate, 'hours') < 3 ? 'is at this game' : (moment().diff(gameDate, 'hours') >= 3 ? 'attended this game' : 'is going to this game')}
                    </Typography>
                  )}
                  <Typography className={classes.postText} dangerouslySetInnerHTML={{ __html: this.htmlDecode(text) }} />
                  <Typography><em>{moment(postData.postDate).format('M/D/YYYY, h:mm a')}</em></Typography>
                  {this.props.user && postData && postData.user.id == this.props.user.id && 
                  <Button style={{float: 'right'}} size="small" onClick={() => this.deletePost(postData.id)}>
                    <Delete/> Delete Post
                  </Button>
                  }
                </Col>
              </Row>
            </Paper>
          ) : (
            <Row>
              <Col md={12}> 
                <Typography variant="subheading"><strong>RE:</strong> <Link className="plainLink" component="a" to={`/game/${postData.game.id}`}>
                  {postData.game.Away.name} at {postData.game.Home.name} {moment(postData.game.gameDate).format('M/D/YYYY')}
                </Link>
                </Typography>
                <br/>
                <Typography variant="subheading">
                  <Link className={classes.dashUserLink} component="a" to={`/user/${postData.user.username}`} onClick={() => this.props.handleUserChange(postData.user.username)}>
                    <strong>{postData.user.name ? postData.user.name : postData.user.username}</strong>
                  </Link> said:
                </Typography>
                <Typography className={classes.postText} dangerouslySetInnerHTML={{ __html: this.htmlDecode(text) }} />
                <Row>
                  <Col md={7}>
                    <Typography><em>{moment(postData.postDate).format('M/D/YYYY, h:mm a')}</em></Typography>
                  </Col>
                  <Col md>
                    {this.props.user && postData.user && postData.user.id == this.props.user.id && 
                  <Button className={classes.button} color="secondary" style={{float: 'right'}} size="small" onClick={() => {
                    this.deletePost(postData.id, true);
                  }}>
                    <Delete/> Delete
                  </Button>
                    }
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
        </div>
      </li>
    );}
}

export default withUser(withRouter(withStyles(styles)(Post)));
