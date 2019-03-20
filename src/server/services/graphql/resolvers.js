import logger from '../../helpers/logger';

export default (utils) => {
  // const { db } = this;
  const { db } = utils;
  const { Post, User, Message, Chat } = db.models;

  const resolvers = {
    Post: {
      user(post, args, context) {
        return post.getUser();
      },
    },
    Message: {
      user(message, args, context) {
        return message.getUser();
      },
      chat(message, args, context) {
        return message.getUser();
      },
    },
    Chat: {
      messages(chat, args, context) {
        return chat.getMessages({ order: [['id', 'ASC']] });
      },
      users(chat, args, context) {
        return chat.getUsers();
      },
    },
    RootQuery: {
      posts(root, args, context) {
        return Post.findAll({ order: [['createdAt', 'DESC']] });
      },
      chats(root, args, context) {
        return User.findAll().then((users) => {
          if (!users.length) {
            return [];
          }

          const usersRow = users[0];

          return Chat.findAll({
            include: [{
              model: User,
              required: true,
              through: { where: { userId: usersRow.id } },
            },
            {
              model: Message,
            }],
          });
        });
      },
      chat(root, { chatId }, context) {
        return Chat.findByPk(chatId, {
          include: [{
            model: User,
            required: true,
          },
          {
            model: Message,
          }],
        });
      },
    },
    RootMutation: {
      addPost(root, { post }, context) {
        logger.log({
          level: 'info',
          message: 'Post was created',
        });

        // // Sleep to test loading
        // let seconds = 10;
        // let waitTill = new Date(new Date().getTime() + seconds * 1000);
        // while(waitTill > new Date()){};

        return User.findAll().then((users) => {
          const usersRow = users[0];
          return Post.create({
            ...post,
          }).then((newPost) => {
            return Promise.all([
              newPost.setUser(usersRow.id),
            ]).then(() => {
              return newPost;
            });
          });
        });
      },
      addChat(root, { chat }, context) {
        logger.log({
          level: 'info',
          message: 'Message was created',
        });
        return Chat.create().then((newChat) => {
          return Promise.all([
            newChat.setUsers(chat.users),
          ]).then(() => {
            return newChat;
          });
        });
      },
      addMessage(root, { message }, context) {
        logger.log({
          level: 'info',
          message: 'Message was created',
        });

        return User.findAll().then((users) => {
          const usersRow = users[0];
          return Message.create({
            ...message,
          }).then((newMessage) => {
            return Promise.all([
              newMessage.setUser(usersRow.id),
              newMessage.setChat(message.chatId),
            ]).then(() => {
              return newMessage;
            });
          });
        });
      },
    },
  };

  return resolvers;
};
