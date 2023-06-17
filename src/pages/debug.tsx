import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

export const getServerSideProps: GetServerSideProps<{
  vercel_url?: string;
}> = async () => {
  return {
    props: {
      vercel_url: process.env.VERCEL_URL,
    },
  };
};

const DebugPage = ({
  vercel_url,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  console.log(process.env.NEXT_PUBLIC_VERCEL_URL)
  return <div className="flex justify-center">{vercel_url}</div>;
};
export default DebugPage;
