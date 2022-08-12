const resolvers = {
  Query: {
    getUser: () => {
      return {
        id: "Foo",
      };
    },
  },
};

export default resolvers;
