const posts = [
  { "id": 1,
    "text": 'ahihi',
    "dontPass": "no value displayed",
    "user": {
      "avatar": "avatar 1",
      "username": "user name 1"
    }
  },
  {
    "text": 'ahaha',
    "dontPass": "no value displayed"
  },
  {
    "id": 3,
    "user": {
      "avatar": "avatar 2"
    }
  },
]

const resolvers = {
  RootQuery: {
    posts(root, args, context) {
      return posts;
    },
  },
  RootMutation: {
    addPost(root, { post, user }, context) {
      const postObject = {
        ...post,
        user,
        id: posts.length + 1,
      };

      posts.push(postObject);
      return postObject;
    },
  },
};

export default resolvers;
