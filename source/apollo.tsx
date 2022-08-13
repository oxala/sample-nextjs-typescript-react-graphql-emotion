import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { NextPage, NextPageContext } from "next";
import { getDataFromTree } from "@apollo/client/react/ssr";
import { SchemaLink } from "@apollo/client/link/schema";
import { GraphQLSchema } from "graphql";
import { ComponentProps } from "react";

interface Props {
  apolloState?: NormalizedCacheObject;
  apolloClient?: ApolloClient<NormalizedCacheObject>;
}

let schema: GraphQLSchema;
let cachedApolloClient: ApolloClient<NormalizedCacheObject>;

// if (typeof window === "undefined") {
//   (async () => {
//     schema = (await import("../source/graphql/schema")).default;
//     console.log("!!!SCHEMA", schema);
//   })();
// }

const getClient = ({ apolloState = {}, schema }: any = { apolloState: {} }) => {
  if (typeof window === "undefined") {
    return new ApolloClient({
      ssrMode: true,
      link: new SchemaLink({ schema }),
      cache: new InMemoryCache(),
    });
  }

  if (!cachedApolloClient) {
    console.log("no cached client", apolloState);
    cachedApolloClient = new ApolloClient({
      cache: new InMemoryCache().restore(apolloState),
      uri: "/api/v1/graphql",
      credentials: "same-origin",
    });
  }

  return cachedApolloClient;
};

export const withApollo = (Page: NextPage, { ssr = true } = {}) => {
  type WithApolloProps = Props & ComponentProps<typeof Page>;

  const WithApollo: NextPage<WithApolloProps> = ({
    apolloClient,
    apolloState,
    ...pageProps
  }) => {
    console.log("WITH APOLLO", typeof apolloClient, apolloState, pageProps);
    let client = apolloClient || getClient({ apolloState });

    return (
      <ApolloProvider client={client}>
        <Page {...pageProps} />
      </ApolloProvider>
    );
  };

  if (ssr || Page.getInitialProps) {
    WithApollo.getInitialProps = async (context: NextPageContext) => {
      const { AppTree, req, res } = context;
      const apolloClient = getClient(req ? { schema: req.schema } : undefined);
      let apolloState: NormalizedCacheObject = {};
      let pageProps = {};

      // console.log("req.schema", req.schema);

      if (Page.getInitialProps) {
        pageProps = await Page.getInitialProps(context);
      }

      if (typeof window === "undefined") {
        // require('../source/graphql/schema')
        // console.log(
        //   "EVAL",
        //   eval("require('../../../source/graphql/schema')").default
        // );
        if (res?.writableEnded) {
          return pageProps;
        }

        if (ssr) {
          try {
            await getDataFromTree(
              <AppTree
                pageProps={{
                  ...pageProps,
                  apolloClient,
                }}
              />
            );
          } catch (exception) {
            exception;
          }

          apolloState = apolloClient.cache.extract();
        }
      }

      return {
        ...pageProps,
        apolloState,
      };
    };
  }

  return WithApollo;
};

export const withApollo2 = (App: any) => {};
