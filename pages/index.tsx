import { NextPage, NextPageContext } from "next";
import Link from "next/link";
import { useGetUserQuery } from "../source/gql";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { withApollo } from "../source/apollo";
import { withApollo as withApollo2 } from "../source/apollo2";
import { Fragment } from "react";
import Test from "../components/Test";

const Page: NextPage = () => {
  const { data } = useGetUserQuery({ variables: { id: "1" } });

  console.log(data);

  return (
    <div>
      <h1 css={{ color: "green" }}>
        Welcome <div className={data?.getUser.id} />
      </h1>
      <Link href="/second">Go to Second Page</Link>
      <Test />
    </div>
  );
};

export default withApollo(Page);
