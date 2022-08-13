import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { NextPage, NextPageContext } from "next";
import { getDataFromTree } from "@apollo/client/react/ssr";
import { SchemaLink } from "@apollo/client/link/schema";
import { ComponentProps } from "react";
import { GraphQLSchema } from "graphql";

interface Props {
  apolloState?: NormalizedCacheObject;
  apolloClient?: ApolloClient<NormalizedCacheObject>;
}

let cachedApolloClient: ApolloClient<NormalizedCacheObject>;

const getClient = (
  apolloState: NormalizedCacheObject = {},
  config?: {
    schema: GraphQLSchema;
    context?: NextPageContext;
  }
) => {
  const cache = new InMemoryCache().restore(apolloState);

  if (config && typeof window === "undefined") {
    return new ApolloClient({
      ssrMode: true,
      link: new SchemaLink(config),
      cache,
    });
  }

  if (!cachedApolloClient) {
    cachedApolloClient = new ApolloClient({
      cache,
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
    let client = apolloClient || getClient(apolloState);

    return (
      <ApolloProvider client={client}>
        <Page {...pageProps} />
      </ApolloProvider>
    );
  };

  if (ssr || Page.getInitialProps) {
    WithApollo.getInitialProps = async (context: NextPageContext) => {
      const { AppTree, req, res } = context;
      const apolloClient = getClient(
        undefined,
        req
          ? {
              schema: (req as any).schema,
              // schema: eval("require('../../../source/graphql/schema')")
              //   .default as GraphQLSchema,
              context,
            }
          : undefined
      );
      let pageProps = {};

      if (Page.getInitialProps) {
        pageProps = await Page.getInitialProps(context);
      }

      if (typeof window === "undefined") {
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
        }
      }

      return {
        ...pageProps,
        apolloState: apolloClient.cache.extract(),
      };
    };
  }

  return WithApollo;
};

export const withApollo2 = (App: any) => {};
