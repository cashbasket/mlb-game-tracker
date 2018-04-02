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
import API from '../utils/api';
import Avatar from 'material-ui/Avatar';

const styles = theme => ({
  avatar: {
    width: 120,
    height: 120,
    border: `1px solid ${theme.palette.primary.main}`
  },
  post: {
    padding: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  postText: {
    fontSize: 16
  }
});

class Post extends React.Component {
  htmlDecode = (input) => {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.innerHTML;
  }

  deletePost = (postId) => {
    API.deletePost(postId)
      .then((res) => {
        this.props.getPosts(this.props.postData.gameId);
      });
  }

  render() {
    const { classes, postData } = this.props;
    const text = postData.postText;
    return (
      <li>
        <div>
          <Paper className={classes.post}>     
            <Row>
              <Col md={2}>
                <Link to={`/user/${postData.user.username}`}>
                  <Avatar
                    alt={postData.user.username}
                    src={postData.user.gravatar}
                    className={classes.avatar}
                  />
                </Link>
              </Col>
              <Col md={10}> 
                <Typography variant="subheading">
                  <Link to={`/user/${postData.user.username}`}>
                    <strong>{postData.user.username}</strong>
                  </Link> said:
                </Typography>
                <Typography className={classes.postText} dangerouslySetInnerHTML={{ __html: this.htmlDecode(text) }} />
                <Typography><em>{moment(postData.postDate).format('M/D/YYYY, h:mm a')}</em></Typography>
                {postData.user.id == this.props.user.id && 
                  <Button style={{float: 'right'}} size="small" onClick={() => this.deletePost(postData.id)}>
                    <Delete/> Delete Post
                  </Button>
                }
              </Col>
            </Row>
          </Paper>
        </div>
      </li>
    );}
}

export default withUser(withRouter(withStyles(styles)(Post)));
