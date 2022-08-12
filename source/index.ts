import { ApolloServer } from "apollo-server-express";
import express from "express";
import next from "next";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginDrainHttpServer,
} from "apollo-server-core";
import { createServer } from "http";
import "./graphql/schema";
import schema, { resolvers, typeDefs } from "./graphql/schema";

const { PORT = "3000" } = process.env;
const app = next({ dev: !process.env.NODE_ENV });
const handle = app.getRequestHandler();

(async () => {
  await app.prepare();

  const server = express();
  const httpServer = createServer(server);
  const apolloServer = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
    csrfPrevention: true,
    cache: "bounded",
  });

  await apolloServer.start();

  server.all("*", (req, _, next) => {
    req.schema = schema;
    // console.log("reqschema", schema);
    next();
  });
  apolloServer.applyMiddleware({ app: server, path: "/api/v1/graphql" });
  server.all("*", (req, res) => handle(req, res));
  server.listen(PORT, () => console.info(`Application started on ${PORT}`));
})();
