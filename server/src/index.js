import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { getUserId, getUser } from './utils/auth.js';

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const userId = (req && req.headers.authorization ? getUserId(req) : null);
    const user = (userId ? await getUser(userId, prisma) : null);
    return {
      ...req,
      prisma,
      userId: userId,
      user: user
    };
  },
});

const port = process.env.PORT || 4001;

server.listen({ port }).then(({ url}) => {
  console.log(`🚀 GraphQL Server ready at: ${url}`);
});