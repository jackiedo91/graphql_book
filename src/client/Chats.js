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

const GET_CHAT = gql`
  query chat($chatId: Int!) {
    chat(chatId: $chatId) {
      id
      users {
        id
        avatar
        username
      }
      messages {
        id
        text
        user {
            id
        }
      }
    }
  }
`;

export default class Chats extends Component {
  state = {
    openChats: [],
  }

  openChat = (id) => {
    var openChats = this.state.openChats.slice();

    if(openChats.indexOf(id) === -1) {
      if(openChats.length > 2) {
        openChats = openChats.slice(1);
      }
      openChats.push(id);
    }

    this.setState({ openChats });
  }

  closeChat = (id) => {
    var openChats = this.state.openChats.slice();
    const index = openChats.indexOf(id);
    openChats.splice(index,1),

    this.setState({ openChats });
  }

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
    const self = this;
    const { openChats } = this.state;

    return (
      <div className="wrapper">
        <div className="chats">
          <Query query={GET_CHATS}>
            { ({ loading, error, data }) => {
                if (loading) return "Loading...";
                if (error) return error.message;

                const { chats } = data;

                return chats.map((chat, i) =>
                  <div key={chat.id} className="chat" onClick={() => self.openChat(chat.id)}>
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
        <div className="openChats">
          {openChats.map((chatId, i) =>
            <Query key={"chatWindow" + chatId} query={GET_CHAT} variables={{ chatId }}>
              {({ loading, error, data }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return error.message;

                const { chat } = data;

                return (
                  <div className="chatWindow">
                    <div className="header">
                      <span>{chat.users[1].username}</span>
                      <button className="close">X</button>
                    </div>
                    <div className="messages">
                      {chat.messages.map((message, j) =>
                        <div key={'message' + message.id} className={'message ' + (message.user.id > 1 ? 'left' : 'right')}>
                          {message.text}
                        </div>
                      )}
                    </div>
                  </div>
                )
              }}
            </Query>
          )}
        </div>
      </div>
    )
  }
}



