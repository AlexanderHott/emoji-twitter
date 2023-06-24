import { RedirectToSignIn, useUser } from "@clerk/nextjs";
import { PageLayout } from "~/components/Layout";
import { LoadingPage } from "~/components/Loading";
import { PostView } from "~/components/PostView";
import { api } from "~/utils/api";
import { CreatePostWizard } from ".";

const FollowingFeed = ({followerId}: {followerId: string}) => {
  const {
    data: posts,
    isLoading: postIsLoading,
    error: postError,
  } = api.post.getFollowingPosts.useQuery({followerId});

  if (postIsLoading) return <LoadingPage />;

  if (postError) {
    return (
      <div className="absolute top-0 right-0 flex h-screen w-screen items-center justify-center">
        Failed to load posts
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {posts?.map((props) => <PostView key={props.post.id} {...props} />)}
    </div>
  );
};

const FeedPage = () => {
  const { isLoaded: userIsLoaded, isSignedIn, user } = useUser();

  // start loading posts immediately
  api.post.getFollowingPosts.useQuery({ followerId: user?.id || "" });
  if (!userIsLoaded) return null;
  if (!user) return <RedirectToSignIn />;

  return (
    <PageLayout>
      {isSignedIn && (
        <div className="flex border-b border-slate-400 p-4">
          <CreatePostWizard />
        </div>
      )}
      <FollowingFeed followerId={user.id}/>
    </PageLayout>
  );
};

export default FeedPage;
