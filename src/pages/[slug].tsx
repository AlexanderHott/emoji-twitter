import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
// import { useRouter } from "next/router";
import { PageLayout } from "~/components/Layout";
import { LoadingPage } from "~/components/Loading";
import { PostView } from "~/components/PostView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/Tabs";
import { generateSSGHelper } from "~/server/utils";
import { api } from "~/utils/api";

export const getStaticProps: GetStaticProps = async (context) => {
    const ssg = generateSSGHelper();

    const slug = context.params?.slug;

    if (typeof slug !== "string") throw new Error("no slug");

    const username = slug.replace("@", "");

    await ssg.profile.getByUsername.prefetch({ username });

    return {
        props: {
            trpcState: ssg.dehydrate(),
            username,
        },
    };
};

export const getStaticPaths = () => {
    return { paths: [], fallback: "blocking" };
};

const ProfileFeed = ({ userId }: { userId: string }) => {
    const { data, isLoading, error } = api.post.getByUserId.useQuery({
        userId,
    });

    if (isLoading) return <LoadingPage />;
    if (error) return <div>{error.message}</div>;
    if (!data || data.length === 0) return <div>User has no posts yet.</div>;

    return (
        <div>
            {data.map(({ post, author }) => (
                <PostView post={post} author={author} key={post.id} />
            ))}
        </div>
    );
};

const LikesFeed = ({ userId }: { userId: string }) => {
    const { data, isLoading, error } = api.post.getLikedPosts.useQuery({ userId });
    if (isLoading) return <LoadingPage />;
    if (error) return <div>{error.message}</div>;
    if (!data) return <div>no likes</div>;

    return (
        <div>
            {data.map(({ post, author }) => (
                <PostView post={post} author={author} key={post.id} />
            ))}
        </div>
    );
}


const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
    const { data: user } = api.profile.getByUsername.useQuery({
        username,
    });
    // const router = useRouter();

    // if (!router.isReady) return null;
    if (!user) {
        return <div>404</div>;
    }


    // onClick={() => router.push(
    //     { pathname: `@${username}?tab=posts` },
    //     undefined,
    //     { shallow: true })}


    return (
        <>
            <Head>
                <title>{username}</title>
            </Head>
            <PageLayout>
                <div className="relative h-36 border-slate-400 bg-slate-600">
                    <Image
                        src={user.profileImageUrl}
                        alt={`${username}'s profile picture`}
                        width={128}
                        height={128}
                        className=" absolute bottom-0 left-0 -mb-16 ml-4 rounded-full border-4 border-black bg-black"
                    />
                </div>
                <div className="mt-16" />
                <div className="p-4 text-2xl font-bold">{`@${username}`}</div>
                <Tabs defaultValue={"posts"} >
                    <TabsList className="w-full mb-2">
                        <TabsTrigger
                            value="posts"
                        >
                            Posts & Reposts
                        </TabsTrigger>
                        <TabsTrigger value="likes">
                            Likes
                        </TabsTrigger>
                    </TabsList>
                    <div className="w-full border-b border-slate-400" />
                    <TabsContent value="posts">
                        <ProfileFeed userId={user.id} />
                    </TabsContent>
                    <TabsContent value="likes">
                        <LikesFeed userId={user.id} />
                    </TabsContent>
                </Tabs>
            </PageLayout >
        </>
    );
};

export default ProfilePage;
