// import { type GetStaticProps, type NextPage } from "next";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { PageLayout } from "~/components/Layout";
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
    const { data, isLoading } = api.post.getById.useQuery({ id });
    if (isLoading || !data) return <div>loading</div>;
    // if (!data) return <div>404</div>;

    return (
        <>
            <Head>
                <title>{`${data.post.content} - @${data.author.username}`}</title>
            </Head>
            <PageLayout>
                <PostView post={data.post} author={data.author} />
            </PageLayout>
        </>
    );
};

export default SinglePostPage;
