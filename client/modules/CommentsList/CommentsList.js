import React from 'react';
import axios from 'axios';
import Comment from '../Comment/Comment';
import Modal from 'react-modal';

// css
import css from './CommentsList.scss';

class CommentsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: [],
      currentComment: {},
      deleteModalIsOpen: false,
      editModalIsOpen: false
    };
  }

 componentDidMount() {
    axios.get(`/comments`)
      .then(res => {
        console.log(res.data);
        const comments = res.data;
        this.setState({ comments });
      });
  }

  actionHandler(comment, action) {
    console.log(action, comment);
    // set the draft to be the comment itself at the start if non exists
    comment.draft = comment.draft || comment.comment;
    let state = {currentComment: comment};
    if (action === 'delete') {
      state.deleteModalIsOpen = true;
    } else if (action === 'edit') {
      state.editModalIsOpen = true;
    }
    this.setState(state);
  }

  closeModal() {
    this.setState({
      deleteModalIsOpen: false,
      editModalIsOpen: false,
      currentComment: {}
    });
  }

  doDelete() {
    axios.delete(`/comments/${this.state.currentComment.id}`)
      .then(res => {
        console.log(res.data);
        const comments = this.state.comments.filter(comment => {
          return comment.id !== this.state.currentComment.id;
        })
        this.setState({comments});
        this.closeModal();
      });
  }

  doEdit() {
    let currentComment = this.state.currentComment;
    // save the draft
    currentComment.comment = currentComment.draft;
    axios.put(`/comments/${this.state.currentComment.id}`, currentComment)
      .then(res => {
        console.log(res.data);
        this.setState({currentComment});
        this.closeModal();
      });
  }

  onCommentChange(event) {
    console.log(event.target.value);
    let currentComment = this.state.currentComment;
    currentComment.draft = event.target.value;
    this.setState({currentComment});
  }

  render() {
    const customStyles = {
      content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
      }
    };
    return (
      <div>
        <ul className="list-group">
        {this.state.comments.map(comment =>
            <Comment key={comment.id} data={comment} onAction={this.actionHandler.bind(this, comment)}/>  
        )}
        </ul>
        
        <Modal
          isOpen={this.state.deleteModalIsOpen}
          onRequestClose={this.closeModal.bind(this)}
          style={customStyles}
          contentLabel="Delete"
        >
          <div className="modalBasic">
            <h2>Delete</h2>
            <div className="buttons">
              <button onClick={this.closeModal.bind(this)} className="btn btn-default btn-lg">No</button>
              <button onClick={this.doDelete.bind(this)} className="btn btn-danger btn-lg">Yes</button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={this.state.editModalIsOpen}
          onRequestClose={this.closeModal.bind(this)}
          style={customStyles}
          contentLabel="Edit"
        >
          <div className="modalBasic">
            <h2>Edit</h2>
            <div>
              <textarea 
                value={this.state.currentComment.draft}
                onChange={this.onCommentChange.bind(this)}
              />
            </div>
            <div className="buttons">
              <button onClick={this.closeModal.bind(this)} className="btn btn-default btn-lg">Cancel</button>
              <button onClick={this.doEdit.bind(this)} className="btn btn-danger btn-lg">Save</button>
            </div>
          </div>
        </Modal>

      </div>
    );
  }
}

export default CommentsList;