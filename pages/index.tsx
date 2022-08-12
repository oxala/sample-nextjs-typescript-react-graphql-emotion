import { NextPage } from "next";
import Link from "next/link";
import { withApollo } from "../source/apollo";
import { useGetUserQuery } from "../source/gql";

const Page: NextPage = () => {
  const { data } = useGetUserQuery();

  return (
    <section>
      <h1 css={{ color: "green" }}>Welcome {data && data.getUser.id}</h1>
      <Link href="/second">Go to Second Page</Link>
    </section>
  );
};

export default withApollo(Page);
