import React, { Component, Fragment } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import API from '../utils/api';
import { withUser } from '../services/withUser';
import Button from 'material-ui/Button';
import RichTextEditor from 'react-rte';

class CommentEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: RichTextEditor.createEmptyValue()
    };
  }

  componentDidMount = () => {
    if (this.props.commentContent) {
      this.setState({
        value: RichTextEditor.createValueFromString(this.props.commentContent, 'html')
      });
    }
  }

  onChange = (value) => {
    this.setState({value});
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.value.toString('html') !== '<p><br></p>') {
      if (!this.props.commentId) {
        API.createComment(this.props.user.id, this.props.postId, this.state.value.toString('html'))
          .then(() => {
            this.props.send();
            this.props.getComments(() => {
              var commentsDiv = document.getElementById(`comments-${this.props.postId}`);
              commentsDiv.scrollTop = commentsDiv.scrollHeight;
            });
            this.setState({value: RichTextEditor.createEmptyValue()});
          });
      } else {
        API.updateComment(this.props.commentId, this.state.value.toString('html'))
          .then(() => {
            this.setState({value: RichTextEditor.createEmptyValue()});
            this.props.updateEditStatus(false);
            this.props.getComments();
          });
      }
    }
  }
          
  render () {
    const toolbarConfig = {
      // Optionally specify the groups to display (displayed in the order listed).
      display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS'],
      INLINE_STYLE_BUTTONS: [
        {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
        {label: 'Italic', style: 'ITALIC'},
        {label: 'Underline', style: 'UNDERLINE'}
      ],
      BLOCK_TYPE_BUTTONS: [
        {label: 'UL', style: 'unordered-list-item'},
        {label: 'OL', style: 'ordered-list-item'}
      ]
    };
    return (
      <Fragment>
        <RichTextEditor
          value={this.state.value}
          onChange={this.onChange}
          toolbarConfig={toolbarConfig}
          placeholder="Leave a comment..."
        />
        {this.props.commentContent ? (
          <Row>
            <Col md>
              <Button fullWidth size="small" variant="raised" color="primary" onClick={this.handleSubmit}>
                Submit Edits
              </Button>
            </Col>
            <Col md>
              <Button fullWidth size="small" variant="raised" color="secondary" onClick={() => this.props.updateEditStatus(false)}>
                Cancel
              </Button>
            </Col>
          </Row>
        ) : (
          <Button fullWidth size="small" variant="raised" color="primary" onClick={this.handleSubmit}>
          Submit Comment
          </Button>
        )}
      </Fragment>
    );
  }
}

export default withUser(CommentEditor);