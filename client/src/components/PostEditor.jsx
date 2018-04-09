import React, { Component, Fragment } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import API from '../utils/api';
import { withUser } from '../services/withUser';
import Button from 'material-ui/Button';
import RichTextEditor from 'react-rte';

class PostEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: RichTextEditor.createEmptyValue()
    };
  }

  componentDidMount = () => {
    if (this.props.postContent) {
      this.setState({
        value: RichTextEditor.createValueFromString(this.props.postContent, 'html')
      });
    }
  }

  onChange = (value) => {
    this.setState({value});
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.value.toString('html') !== '<p><br></p>') {
      if (!this.props.postId) {
        API.createPost(this.props.user.id, this.props.gameId, this.state.value.toString('html'))
          .then(() => {
            this.setState({value: RichTextEditor.createEmptyValue()});
          });
      } else {
        API.updatePost(this.props.postId, this.state.value.toString('html'))
          .then(() => {
            this.setState({value: RichTextEditor.createEmptyValue()});
            this.props.updateEditStatus(false);
            this.props.getPosts();
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
          placeholder="Write something about the game..."
        />
        {this.props.postContent ? (
          <Row>
            <Col md>
              <Button fullWidth variant="raised" color="primary" onClick={this.handleSubmit}>
                Submit Edits
              </Button>
            </Col>
            <Col md>
              <Button fullWidth variant="raised" color="secondary" onClick={() => this.props.updateEditStatus(false)}>
                Cancel
              </Button>
            </Col>
          </Row>
        ) : (
          <Button fullWidth variant="raised" color="primary" onClick={this.handleSubmit}>
          Submit Post
          </Button>
            
        )}
      </Fragment>
    );
  }
}

export default withUser(PostEditor);