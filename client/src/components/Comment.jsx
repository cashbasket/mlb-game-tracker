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
import API from '../utils/api';
import Avatar from 'material-ui/Avatar';
import Edit from 'material-ui-icons/Edit';
import CommentEditor from './CommentEditor';

const styles = theme => ({
  avatar: {
    border: `1px solid ${theme.palette.secondary.dark}`,
    width: 80,
    height: 'auto',
    marginBottom: theme.spacing.unit
  },
  buttonText: theme.typography.button,
  attending: {
    color: theme.palette.primary.main
  },
  commentText: {
    fontSize: 16
  },
  button: {
    marginTop: theme.spacing.unit
  },
  dashUserLink: {
    borderBottom: 'none'
  },
  commentBody: {
    backgroundColor: '#fff',
    borderRadius: 7,
    padding: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
    fontSize: 14
  }
});

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false
    };
    this.updateEditStatus = this.updateEditStatus.bind(this);
  }
  htmlDecode = (input) => {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.innerHTML;
  }

  updateEditStatus = (bool) => {
    this.setState({ isEditing: bool });
  }

  deleteComment = (commentId) => {
    API.deleteComment(commentId)
      .then(() => {
        this.props.getComments();
      });
  }

  render() {
    const { classes, commentData, gameDate } = this.props;
    const { isEditing } = this.state;
    const text = commentData.commentText;
    return (
      <li>
        <Fragment>
          <Row>
            <Col md={1}>
              <Link className="plainLink" to={`/user/${commentData.user.username}`}>
                <Avatar 
                  alt={commentData.user.username}
                  src={commentData.user.gravatar}
                  className={`img-fluid ${classes.avatar}`}
                />
              </Link>
            </Col>
            <Col md>
              <div className={classes.commentBody}>
                <Typography variant="subheading">
                  <Link to={`/user/${commentData.user.username}`}>
                    <strong>{commentData.user.name ? commentData.user.name : commentData.user.username}</strong>
                  </Link>
                </Typography>
                {isEditing ? (
                  <CommentEditor commentId={commentData.id} commentContent={this.htmlDecode(text)} updateEditStatus={this.updateEditStatus} getComments={this.props.getComments}/>
                ) : (
                  <Fragment>
                    <Typography className={classes.commentText} dangerouslySetInnerHTML={{ __html: this.htmlDecode(text) }} />
                    <Row>
                      <Col md={6}>
                        <Typography><em>{moment(commentData.commentDate).format('M/D/YYYY, h:mm a')}</em></Typography>
                      </Col>
                      <Col md>
                        {this.props.user && commentData && commentData.user.id == this.props.user.id && 
                  <Row>
                    <Col md style={{textAlign: 'right'}}>
                      <Button  size="small" onClick={() => this.updateEditStatus(true)}>
                        <Edit/> Edit
                      </Button>
                      <Button  size="small" onClick={() => this.deleteComment(commentData.id)}>
                        <Delete/> Delete
                      </Button>
                    </Col>
                  </Row>
                        }
                      </Col>
                    </Row>
                  </Fragment>
                )}
              </div>
            </Col>
          </Row>         
        </Fragment>
      </li>
    );}
}

export default withUser(withRouter(withStyles(styles)(Comment)));
