import React, { Component } from 'react';
import '../../assets/css/style.css';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const GET_POSTS = gql`{
  posts {
    id
    text
    user {
      avatar
      username
    }
  }
}`;


class Feed extends Component {
  state = {
    postContent: '',
  };

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     posts,
  //   };
  // }

  handlePostContentChange = (event) => {
    this.setState({
      postContent: event.target.value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const newPost = {
      id: this.state.posts.length + 1,
      text: this.state.postContent,
      user: {
        avatar: '/uploads/avatar1.png',
        username: 'Fake User'
      }
    };

    this.setState((prevState) => ({
      posts: [newPost, ...prevState.posts],
      postContent: ''
    }));
  }

  render() {
    const { posts, loading, error } = this.props;
    const { postContent } = this.state;

    if(loading) {
      return "Loading...";
    }
    if(error) {
      return error.message;
    }


    return (
      <div className="container">
        <div className="postForm">
          <form onSubmit={this.handleSubmit}>
            <textarea value={postContent} onChange={this.handlePostContentChange} placeholder="Write your custom post!"/>
            <input type="submit" value="Submit" />
          </form>
        </div>

        <div className="feed">
          {posts.map((post, i) =>
            <div key={post.id} className="post">
              <div className="header">
                <img src={post.user.avatar} />
                <h2>{post.user.username}</h2>
              </div>
              <p className="content">
                {post.text}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default graphql(GET_POSTS, {
  props: ({ data: { loading, error, posts }} ) => ({
    loading,
    posts,
    error
  })
})(Feed)
