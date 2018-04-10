import React, { Fragment } from 'react';
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
import Comment from './Comment';
import API from '../utils/api';
import Avatar from 'material-ui/Avatar';
import Edit from 'material-ui-icons/Edit';
import CommentsIcon from 'material-ui-icons/Comment';
import PostList from './PostList';
import PostEditor from './PostEditor';
import CommentEditor from './CommentEditor';

const styles = theme => ({
  avatar: {
    width: 100,
    height: 100,
    border: `1px solid ${theme.palette.secondary.dark}`
  },
  iconLeft: {
    marginRight: theme.spacing.unit / 2
  },
  buttonText: theme.typography.button,
  attending: {
    color: theme.palette.primary.main
  },
  post: {
    padding: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2
  },
  postText: {
    fontSize: 16
  },
  button: {
    marginTop: theme.spacing.unit
  },
  dashUserLink: {
    borderBottom: 'none'
  },
  commentEditor: {
    paddingBottom: theme.spacing.unit * 2
  },
  comments: {
    backgroundColor: '#b0bec5',
    paddingTop: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2
  }
});

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postId: this.props.postData.id,
      gameDate: '',
      gameTitle: '',
      comments: [],
      commentsVisible: false,
      isEditing: false
    };
    this.getComments = this.getComments.bind(this);
    this.updateEditStatus = this.updateEditStatus.bind(this);
  }

  componentDidMount = () => {
    this.getComments();
  }

  toggleComments = () => {
    this.setState({commentsVisible: !this.state.commentsVisible }, () => {
      () => {
        var commentsDiv = document.getElementById(`comments-${this.props.postData.id}`);
        commentsDiv.scrollTop = commentsDiv.scrollHeight;
      };
    });
  }

  getComments = (fn) => {
    API.getComments(this.state.postId)
      .then((res) => {
        this.setState({comments: res.data.comments}, () => {
          if (typeof fn === 'function') {
            fn();
          }
        });
      });
  }

  htmlDecode = (input) => {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.innerHTML;
  }

  updateEditStatus = (bool) => {
    this.setState({ isEditing: bool });
  }

  deletePost = (postId) => {
    API.deletePost(postId)
      .then(() => {
        this.props.getPosts();
      });
  }

  render() {
    //testing for socket connections
    // socket.on('comment', () => {
    //   this.getComments();
    // });
    const { classes, postData, dashboard, gameDate } = this.props;
    const { isEditing, comments, commentsVisible } = this.state;
    const text = postData.postText;
    const gameDateTime = moment(gameDate, 'YYYY-MM-DD HH:mm:ss');
    return (
      <li>
        <div>
          {!dashboard ? (
            <Fragment>
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
                        {moment().diff(gameDateTime, 'hours') > -1 && moment().diff(gameDateTime, 'hours') < 3 ? 'is at this game' : (moment().diff(gameDateTime, 'hours') >= 3 ? 'attended this game' : 'is going to this game')}
                      </Typography>
                    )}
                    {isEditing ? (
                      <PostEditor postId={postData.id} postContent={this.htmlDecode(text)} updateEditStatus={this.updateEditStatus} getPosts={this.props.getPosts}/>
                    ) : (
                      <Fragment>
                        <Typography className={classes.postText} dangerouslySetInnerHTML={{ __html: this.htmlDecode(text) }} />
                        <Typography><em>{moment(postData.postDate).format('M/D/YYYY, h:mm a')}</em></Typography>
                      </Fragment>
                    )}
                    
                    {this.props.user && postData && postData.user.id == this.props.user.id && 
                  <Fragment>
                    <Button style={{float: 'right'}} size="small" onClick={() => this.deletePost(postData.id)}>
                      <Delete className={classes.iconLeft}/> Delete
                    </Button>
                    <Button style={{float: 'right'}} size="small" onClick={() => this.updateEditStatus(true)}>
                      <Edit className={classes.iconLeft}/> Edit
                    </Button>
                  </Fragment>
                    }
                    <Button style={{float: 'right'}} size="small" onClick={() => { 
                      if (!commentsVisible)
                        this.getComments();
                      this.toggleComments() ;
                    } }>
                      <CommentsIcon className={classes.iconLeft}/> Comments ({comments.length})
                    </Button>
                  </Col>
                </Row>
              </Paper>
              <Row className="commentSection" style={{display: this.state.commentsVisible ? 'block' : 'none'}}>
                <Col md>
                  <Paper className={classes.comments} >
                    <div className={classes.commentEditor}>
                      <CommentEditor postId={postData.id} getComments={this.getComments} />
                    </div>
                    <div id={`comments-${postData.id}`} className={classes.commentsListDiv} style={{display: comments.length ? 'block' : 'none'}}>
                      <PostList>
                        {comments && 
                       comments.map(comment => (
                         <Comment key={comment.id} commentData={comment} getComments={this.getComments} />
                       ))
                        }
                      </PostList>
                    </div>
                  </Paper>
                </Col>
              </Row>
            </Fragment>
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
