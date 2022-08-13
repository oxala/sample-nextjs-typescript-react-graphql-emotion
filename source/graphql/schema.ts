import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { stitchSchemas } from "@graphql-tools/stitch";

const typesArray = loadFilesSync(process.cwd() + "/**/typeDefs/*.graphql");
const resolversArray = loadFilesSync(process.cwd() + "/**/resolvers/*.ts");

export const { typeDefs, resolvers } = {
  typeDefs: mergeTypeDefs(typesArray),
  resolvers: mergeResolvers(resolversArray),
};

export default stitchSchemas({ typeDefs, resolvers });
