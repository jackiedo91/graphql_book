import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const GET_CHATS = gql`{
  chats {
    id
    users {
      id
      avatar
      username
    }
    lastMessage {
      text
    }
  }
}`;

export default class Chats extends Component {
  usernamesToString(users) {
    const userList = users.slice(1);
    var usernamesString = '';

    for(var i = 0; i < userList.length; i++) {
      usernamesString += userList[i].username;
      if(i - 1 === userList.length) {
        usernamesString += ', ';
      }
    }
    return usernamesString;
  }

  shorten(text) {
    if (text.length > 12) {
      return text.substring(0, text.length - 9) + '...';
    }
    return text;
  }

  render() {

    return (
      <div className="chats">
        <Query query={GET_CHATS}>
          { ({ loading, error, data }) => {
              if (loading) return "Loading...";
              if (error) return error.message;

              const { chats } = data;

              return chats.map((chat, i) =>
                <div key={chat.id} className="chat">
                  <div className='header'>
                    <img src={(chat.users.length > 2 ? '/public/group.png' : chat.users[1].avatar)} />
                    <h2>{this.shorten(this.usernamesToString(chat.users))}</h2>
                    <span>{chat.lastMessage && this.shorten(chat.lastMessage.text)}</span>
                  </div>
                </div>
              )
          }}
        </Query>
      </div>
    )
  }
}
