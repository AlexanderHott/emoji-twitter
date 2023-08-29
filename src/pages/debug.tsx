import type { InferGetServerSidePropsType } from "next";
import { api } from "~/utils/api";

export const getServerSideProps = () => {
  return {
    props: {
      vercel_url: process.env.VERCEL_URL,
    },
  };
};

const DebugPage = ({
  vercel_url,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  console.log("public vercel url", process.env.NEXT_PUBLIC_VERCEL_URL);
  const { isLoading, data: posts, isError, error } = api.exp.test.useQuery();
  if (isLoading) return null;
  if (isError) return <div>{JSON.stringify(error)}</div>;
  return (
    <div className="flex justify-center">
      <div>{vercel_url}</div>
      <div>{posts.map((p) => <div>{p.content}</div>)}</div>
    </div>
  );
};
export default DebugPage;
