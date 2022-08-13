import { useGetUserQuery } from "../source/gql";

const Test = () => {
  const { data } = useGetUserQuery({ variables: { id: "1" } });

  console.log(data);

  return (
    <div>
      <h2>Component </h2>
    </div>
  );
};

export default Test;
