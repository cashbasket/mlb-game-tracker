import React, { Component } from 'react';
import API from '../utils/api';
import { withUser } from '../services/withUser';
import Button from 'material-ui/Button';
import RichTextEditor from 'react-rte';
import Paper from 'material-ui/Paper';

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
        .then(() => {
          this.props.send();
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
      <Paper>
        <RichTextEditor
          value={this.state.value}
          onChange={this.onChange}
          toolbarConfig={toolbarConfig}
          placeholder="Write something about the game..."
        />
        <Button fullWidth variant="raised" color="primary" onClick={this.handleSubmit}>
          Submit Post
        </Button>
      </Paper>
    );
  }
}

export default withUser(PostEditor);