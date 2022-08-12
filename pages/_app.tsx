import { Fragment } from "react";
import Head from "next/head";
import { AppContext, AppProps } from "next/app";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { getDataFromTree } from "@apollo/client/react/ssr";
import { SchemaLink } from "@apollo/client/link/schema";
import schema from "../source/graphql/schema";
import { getInitialProps } from "../source/apollo";

// const apolloClient = new ApolloClient({
//   cache: new InMemoryCache(),
//   uri: "/api/v1/graphql",
//   credentials: "same-origin",
// });

const App = ({ Component, pageProps }: AppProps) => {
  console.log("APP", pageProps);

  return (
    <Fragment>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <title>Sample</title>
      </Head>

      <Component {...pageProps} />
    </Fragment>
  );
};

// export const getServerSideProps = () => {
//   console.log("HEHEHEHEHHEHE");
//   return {};
// };

// export const getInitialProps = () => {
//   console.log("asdasdsdasdasdasdsadas");

//   return {};
// };

// App.getInitialProps = async ({ AppTree, ctx, ...rest }: AppContext) => {
//   // const { req, res, ...rest2 } = ctx;
//   // console.log("rest", AppTree, !!req, !!res, rest);

//   console.log("APP INITAL PROPS");

//   const client = new ApolloClient({
//     ssrMode: true,
//     link: new SchemaLink({ schema }),
//     cache: new InMemoryCache(),
//   });

//   await getDataFromTree(<AppTree pageProps={{ apolloClient: client }} />);

//   const initialState = client.extract();

//   console.log("apptree", initialState);
//   return { pageProps: { initialState } };
// };

export default App;
