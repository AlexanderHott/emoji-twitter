// import { type GetStaticProps, type NextPage } from "next";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { PageLayout } from "~/components/Layout";
import { LoadingPage } from "~/components/Loading";
import { PostView } from "~/components/PostView";
// import { generateSSGHelper } from "~/server/utils";
import { api } from "~/utils/api";

// export const getStaticProps: GetStaticProps = async (context) => {
//   const ssg = generateSSGHelper();
//
//   const id = context.params?.id;
//
//   if (typeof id !== "string") throw new Error("no id");
//
//   await ssg.post.getById.prefetch({ id });
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       id,
//     },
//   };
// };

// export const getStaticPaths = () => {
//   return { paths: [], fallback: "blocking" };
// };

// const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
const SinglePostPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { data: post, isLoading } = api.post.getById.useQuery({ id });
  if (isLoading || !post) return <LoadingPage />;
  // if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{`${post.post.content} - @${post.author.username || ""}`}</title>
      </Head>
      <PageLayout>
        <PostView {...post} />
      </PageLayout>
    </>
  );
};

export default SinglePostPage;
