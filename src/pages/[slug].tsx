import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
// import { useRouter } from "next/router";
import { PageLayout } from "~/components/Layout";
import { LoadingPage } from "~/components/Loading";
import { PostView } from "~/components/PostView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/Tabs";
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

  const { data: postsAndReposts, isLoading: arePostsAndRepostsLoading } =
    api.post.postsAndReposts.useQuery({ userId });

  if (isLoading || arePostsAndRepostsLoading) return <LoadingPage />;
  if (error) return <div>{error.message}</div>;
  if (!data || data.length === 0) return <div>User has no posts yet.</div>;
  if (!postsAndReposts || postsAndReposts.length === 0)
    return <div>User has no posts yet.</div>;

  console.log("Posts and Reposts", postsAndReposts?.length, postsAndReposts);

  return (
    <div>
      {/* {data.map(({ post, author }) => (
        <PostView post={post} author={author} key={post.id} />
      ))} */}

      {postsAndReposts.map(({ post, author }) => (
        <PostView post={post} author={author} key={post.id} />
      ))}
    </div>
  );
};

const LikesFeed = ({ userId }: { userId: string }) => {
  const { data, isLoading, error } = api.post.getLikedPosts.useQuery({
    userId,
  });
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
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data: user } = api.profile.getByUsername.useQuery({
    username,
  });
  // const router = useRouter();
  const { data } = api.profile.getByUsername.useQuery({
    username,
  });

  const { data: emoji } = api.profile.getMostUsedEmojis.useQuery({
    userId: data?.id,
  });

  if (!data) {
    return <div>404</div>;
  }

  return (
    <>
      <Head>
        <title>{username}</title>
      </Head>
      <PageLayout>
        <div className="relative h-36 border-slate-400 bg-slate-600">
          <Image
            src={data.profileImageUrl}
            alt={`${username}'s profile picture`}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-16 ml-4 rounded-full border-4 border-black bg-black"
            priority
          />
          <div className="absolute bottom-0 left-24 -mb-16 ml-4 rounded-full border-4 border-black bg-black">
            {emoji}
          </div>
        </div>
        <div className="mt-16" />
        <div className="p-4 text-2xl font-bold">{`@${username}`}</div>
        <Tabs defaultValue="posts">
          <TabsList className="mb-2 w-full">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="likes">Likes</TabsTrigger>
          </TabsList>
          <div className="w-full border-b border-slate-400" />
          <TabsContent value="posts">
            <ProfileFeed userId={data.id} />
          </TabsContent>
          <TabsContent value="likes">
            <LikesFeed userId={user?.id || ""} />
          </TabsContent>
        </Tabs>
      </PageLayout>
    </>
  );
};

export default ProfilePage;
