import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
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

  onChange = (value) => {
    this.setState({value});
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.value.toString('html') !== '<p><br></p>') {
      API.createPost(this.props.user.id, this.props.gameId, this.state.value.toString('html'))
        .then((res) => {
          this.props.getPosts(this.props.gameId);
          this.setState({value: RichTextEditor.createEmptyValue()});
        });
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
      <div>
        <RichTextEditor
          value={this.state.value}
          onChange={this.onChange}
          toolbarConfig={toolbarConfig}
          placeholder="Write something..."
        />
        <Button fullWidth variant="raised" color="primary" onClick={this.handleSubmit}>
          Submit Post
        </Button>
      </div>
    );
  }
}

export default withUser(PostEditor);