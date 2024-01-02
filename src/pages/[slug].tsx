// import { SignedIn, useUser } from "@clerk/nextjs";
import { ShareIcon } from "@heroicons/react/24/outline";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { PageLayout } from "~/components/Layout";
// import { LoadingPage } from "~/components/Loading";
// import { PostView } from "~/components/PostView";
import { PostView } from "~/components/museum/PostView";
import { Button } from "~/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/Tabs";
import { BITES, LIKES, POSTS, USER_MAP, type User } from "~/data/data";
// import { generateSSGHelper } from "~/server/utils";
// import { api } from "~/utils/api";

// export const getStaticProps: GetStaticProps = async (context) => {
//   const ssg = generateSSGHelper();
//
//   const slug = context.params?.slug;
//
//   if (typeof slug !== "string") throw new Error("no slug");
//
//   const username = slug.replace("@", "");
//
//   await ssg.profile.getByUsername.prefetch({ username });
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       username,
//     },
//   };
// };

// export const getStaticPaths = () => {
//   return { paths: [], fallback: "blocking" };
// };

const ProfileFeed = ({ userId }: { userId: string }) => {
  // const { data, isLoading, error } = api.post.getByUserId.useQuery({
  //   userId,
  // });

  // if (isLoading) return <LoadingPage />;
  // if (error) return <div>{error.message}</div>;
  // if (!data || data.length === 0) return <div>User has no posts yet.</div>;
  const user = USER_MAP.get(userId);
  if (!user) {
    return <div>User not found</div>;
  }

  const posts = [...POSTS].filter(
    (p) => user.id === p.authorId || user.id === p.originalAuthorId,
  );
  return (
    <div>
      {posts.map((post) => (
        <PostView {...post} key={post.id} />
      ))}
    </div>
  );
};

const LikesFeed = ({ user }: { user: User }) => {
  // const { data, isLoading, error } = api.post.getLikedPosts.useQuery({
  //   username,
  // });
  // if (isLoading) return <LoadingPage />;
  // if (error) return <div>{error.message}</div>;
  // if (!data) return <div>no likes</div>;
  const likedPostIds = new Set(
    LIKES.filter((l) => l.userId === user.id).map((l) => l.postId),
  );
  const posts = POSTS.filter((p) => likedPostIds.has(p.id));

  return (
    <div>
      {posts.map((post) => (
        <PostView {...post} key={post.id} />
      ))}
    </div>
  );
};

const BitesFeed = ({ user }: { user: User }) => {
  // const { data, isLoading, error } = api.post.getBittenPosts.useQuery({
  //   username,
  // });
  // if (isLoading) return <LoadingPage />;
  // if (error) return <div>{error.message}</div>;
  // if (!data) return <div>no likes</div>;
  const bittenPostIds = new Set(
    BITES.filter((b) => b.userId === user.id).map((b) => b.postId),
  );
  const posts = POSTS.filter((p) => bittenPostIds.has(p.id));

  return (
    <div>
      {posts.map((post) => (
        <PostView {...post} key={post.id} />
      ))}
    </div>
  );
};
const ProfilePage: NextPage = () => {
  // const { isLoaded: authLoaded } = useUser();
  // const { data: user } = api.profile.getByUsername.useQuery({
  //   username,
  // });
  // const { data: followStats, isLoading: isFollowStatsLoaded } = api.user
  //   .followStats.useQuery({
  //     userId: user?.id || "",
  //   });
  //
  // const { data: emoji } = api.profile.getMostUsedEmojis.useQuery({
  //   userId: user?.id,
  // });
  // const utils = api.useContext();
  // const { mutate: follow } = api.user.follow.useMutation({
  //   onSettled: async () => {
  //     await utils.user.invalidate();
  //   },
  // });
  // const { mutate: unfollow } = api.user.unfollow.useMutation({
  //   onSettled: async () => {
  //     await utils.user.invalidate();
  //   },
  // });

  // if (!user) {
  //   return <div>404</div>;
  // }
  //
  // if (!authLoaded || isFollowStatsLoaded) {
  //   return null;
  // }
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const user = USER_MAP.get("user");
  if (!user) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{user.username}</title>
      </Head>
      <PageLayout>
        <div className="relative h-36 border-slate-400 bg-slate-600">
          <Image
            src={user.profileImageUrl}
            alt={`${user.username}'s profile picture`}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-16 ml-4 rounded-full border-4 border-black bg-black"
          />

          {/*<div className="absolute bottom-0 left-24 -mb-16 ml-4 rounded-full border-4 border-black bg-black">
            {emoji}
          </div>*/}
        </div>

        <div className="m-4 flex flex-col items-end">
          <div className="flex flex-row gap-4">
            {/*<SignedIn>
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
            </SignedIn>*/}
            <Button
              variant="outline"
              onClick={() => {
                void navigator.clipboard.writeText(
                  `https://${window.location.host}/@${user.username}`,
                );
                toast.success("Copied post URL to clipboard");
              }}
            >
              <ShareIcon height={24} width={24} />
            </Button>
          </div>
        </div>
        {/*<div className="px-4 flex items-center gap-2">
          <span className="text-2xl font-bold ">{`@${user.username}`}</span>
          {followStats?.followsMe &&
            (
              <span className="text-sm text-slate-800 rounded-3xl bg-slate-100 py-0.5 px-1">
                Follows you
              </span>
            )}
        </div>*/}
        <div className="mt-16" />
        <div className="flex gap-8 px-4">
          <div className="text-slate-500">
            <span className="text-slate-300">{user.followers}</span> Followers
          </div>
          <div className="text-slate-500">
            <span className="text-slate-300">{user.following}</span> Following
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
            <LikesFeed user={user} />
          </TabsContent>
          <TabsContent value="bites">
            <BitesFeed user={user} />
          </TabsContent>
        </Tabs>
      </PageLayout>
    </>
  );
};

export default ProfilePage;
