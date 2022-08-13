import { NextPage } from "next";
import Link from "next/link";
import { withApollo } from "../source/apollo";
import { useGetUserQuery } from "../source/gql";

const Page: NextPage = () => {
  const { data } = useGetUserQuery({ variables: { id: "1" } });
  const { data: data2 } = useGetUserQuery({ variables: { id: "2" } });

  console.log(data, data2);

  return (
    <section>
      <h1 css={{ color: "green" }}>Welcome</h1>
      <Link href="/">Go to Main Page</Link>
    </section>
  );
};

export default withApollo(Page);
