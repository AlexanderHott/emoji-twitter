import { SignedIn, useUser } from "@clerk/nextjs";
import { ShareIcon } from "@heroicons/react/24/outline";
import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import toast from "react-hot-toast";
import { PageLayout } from "~/components/Layout";
import { LoadingPage } from "~/components/Loading";
import { PostView } from "~/components/PostView";
import { Button } from "~/components/ui/Button";
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

  if (isLoading) return <LoadingPage />;
  if (error) return <div>{error.message}</div>;
  if (!data || data.length === 0) return <div>User has no posts yet.</div>;
  return (
    <div>
      {data.map((props) => <PostView {...props} key={props.post.id} />)}
    </div>
  );
};

const LikesFeed = ({ username }: { username: string }) => {
  const { data, isLoading, error } = api.post.getLikedPosts.useQuery({
    username,
  });
  if (isLoading) return <LoadingPage />;
  if (error) return <div>{error.message}</div>;
  if (!data) return <div>no likes</div>;

  return (
    <div>
      {data.map((props) => <PostView {...props} key={props.post.id} />)}
    </div>
  );
};

const BitesFeed = ({ username }: { username: string }) => {
  const { data, isLoading, error } = api.post.getBittenPosts.useQuery({
    username,
  });
  if (isLoading) return <LoadingPage />;
  if (error) return <div>{error.message}</div>;
  if (!data) return <div>no likes</div>;

  return (
    <div>
      {data.map((props) => <PostView {...props} key={props.post.id} />)}
    </div>
  );
};
const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { isLoaded: authLoaded } = useUser();
  const { data: user } = api.profile.getByUsername.useQuery({
    username,
  });
  const { data: followStats, isLoading: isFollowStatsLoaded } = api.user
    .followStats.useQuery({
      userId: user?.id || "",
    });

  const { data: emoji } = api.profile.getMostUsedEmojis.useQuery({
    userId: user?.id,
  });
  const utils = api.useContext();
  const { mutate: follow } = api.user.follow.useMutation({
    onSettled: async () => {
      await utils.user.invalidate();
    },
  });
  const { mutate: unfollow } = api.user.unfollow.useMutation();

  if (!user) {
    return <div>404</div>;
  }

  if (!authLoaded || isFollowStatsLoaded) {
    return null;
  }

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
            className="absolute bottom-0 left-0 -mb-16 ml-4 rounded-full border-4 border-black bg-black"
          />

          <div className="absolute bottom-0 left-24 -mb-16 ml-4 rounded-full border-4 border-black bg-black">
            {emoji}
          </div>
        </div>

        <div className="flex items-end flex-col m-4">
          <div className="flex flex-row gap-4">
            <SignedIn>
              {followStats?.iFollow
                ? (
                  <Button
                    variant="outline"
                    onClick={() => unfollow({ leaderId: user.id })}
                  >
                    Unfollow
                  </Button>
                )
                : (
                  <Button
                    variant="default"
                    onClick={() => follow({ leaderId: user.id })}
                  >
                    Follow
                  </Button>
                )}
            </SignedIn>
            <Button
              variant="outline"
              onClick={() => {
                void navigator.clipboard.writeText(
                  `https://${window.location.host}/@${username}`,
                );
                toast.success("Copied post URL to clipboard");
              }}
            >
              <ShareIcon height={24} width={24} />
            </Button>
          </div>
        </div>
        <div className="px-4 flex items-center gap-2">
          <span className="text-2xl font-bold ">{`@${username}`}</span>
          {followStats?.followsMe &&
            (
              <span className="text-sm text-slate-800 rounded-3xl bg-slate-100 py-0.5 px-1">
                Follows you
              </span>
            )}
        </div>
        <div className="mt-16" />
        <div className="flex gap-8 px-4">
          <div className="text-slate-500">
            <span className="text-slate-300">{followStats?.followerCount}</span>
            {" "}
            Followers
          </div>
          <div className="text-slate-500">
            <span className="text-slate-300">
              {followStats?.followingCount}
            </span>{" "}
            Following
          </div>
        </div>
        <div className="mt-4" />
        <Tabs defaultValue="posts">
          <TabsList className="mb-2 w-full">
            <TabsTrigger value="posts">Posts & Reposts</TabsTrigger>
            <TabsTrigger value="likes">Likes</TabsTrigger>
            <TabsTrigger value="bites">Bites</TabsTrigger>
          </TabsList>
          <div className="w-full border-b border-slate-400" />
          <TabsContent value="posts">
            <ProfileFeed userId={user.id} />
          </TabsContent>
          <TabsContent value="likes">
            <LikesFeed username={username} />
          </TabsContent>
          <TabsContent value="bites">
            <BitesFeed username={username} />
          </TabsContent>
        </Tabs>
      </PageLayout>
    </>
  );
};

export default ProfilePage;
