"use client";
import { PageLayout } from "~/components/Layout";
import { PostView } from "~/components/museum/PostView";
import { POSTS } from "~/data/data";
import { useSearchParams } from "next/navigation";

const FollowingFeed = ({ followerId }: { followerId: string | null }) => {
  // const {
  //   data: posts,
  //   isLoading: postIsLoading,
  //   error: postError,
  // } = api.post.getFollowingPosts.useQuery({ followerId });

  // if (postIsLoading) return <LoadingPage />;

  // if (postError) {
  //   return (
  //     <div className="absolute right-0 top-0 flex h-screen w-screen items-center justify-center">
  //       Failed to load posts
  //     </div>
  //   );
  // }

  let posts;
  if (followerId !== undefined) {
    // posts = POSTS.filter((p) => p.authorId);
    posts = POSTS;
  } else {
    posts = POSTS;
  }
  return (
    <div className="flex flex-col">
      {posts?.map((post) => <PostView key={post.id} {...post} />)}
    </div>
  );
};

const FeedPage = () => {
  // const { isLoaded: userIsLoaded, isSignedIn, user } = useUser();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  // start loading posts immediately
  // api.post.getFollowingPosts.useQuery({ followerId: user?.id || "" });
  // if (!userIsLoaded) return null;
  // if (!user) return <RedirectToSignIn />;

  return (
    <PageLayout>
      {false && (
        <div className="flex border-b border-slate-400 p-4">
          {/*<CreatePostWizard />*/}
        </div>
      )}
      <FollowingFeed followerId={userId} />
    </PageLayout>
  );
};

export default FeedPage;
