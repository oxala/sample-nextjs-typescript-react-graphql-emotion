import { NextPage } from "next";
import Link from "next/link";
import { useGetUserQuery } from "../source/gql";
import { withApollo } from "../source/apollo";
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
