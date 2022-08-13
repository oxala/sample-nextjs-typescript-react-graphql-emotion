import { createServer } from "http";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginDrainHttpServer,
} from "apollo-server-core";
import { GraphQLSchema } from "graphql";
import { Application } from "express";

export const startGraphQLServer = async (
  app: Application,
  schema: GraphQLSchema
) => {
  const httpServer = createServer(app);
  const apolloServer = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
    csrfPrevention: true,
    cache: "bounded",
    context: (req) => ({ req }),
  });

  await apolloServer.start();

  app.all("*", (req, _, next) => {
    (req as any).schema = schema;

    next();
  });
  apolloServer.applyMiddleware({ app, path: "/api/v1/graphql" });
};
