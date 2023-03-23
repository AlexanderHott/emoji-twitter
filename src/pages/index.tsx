import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";

import dayjs from "dayjs";

import { api, type RouterOutputs } from "~/utils/api";
import { LoadingPage } from "~/components/Loading";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { PageLayout } from "~/components/Layout";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.post.create.useMutation({
    onSuccess: () => {
      setContent("");
      // `void` tells typescript that we don't care about the result of the promise
      void ctx.post.getAll.invalidate();
    },
    onError: (err) => {
      if (
        err.data?.zodError?.fieldErrors.content &&
        err.data?.zodError?.fieldErrors.content[0]
      ) {
        toast.error(err.data?.zodError?.fieldErrors.content[0]);
      } else {
        toast.error(err.message);
      }
    },
  });
  const [content, setContent] = useState("");

  if (!user) return null;

  return (
    <div className="flex w-full gap-3">
      <Image
        width={56}
        height={56}
        src={user.profileImageUrl}
        alt="pfp"
        className="h-14 w-14 rounded-full"
      />
      <input
        placeholder="Type some emojis"
        className="grow bg-transparent outline-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isPosting}
        onKeyDown={(e) => {
          e.preventDefault();
          if (e.key === "Enter") {
            mutate({ content });
          }
        }}
      />
      <button disabled={isPosting} onClick={() => mutate({ content })}>
        Post
      </button>
    </div>
  );
};

type PostWithUser = RouterOutputs["post"]["getAll"][number];
const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div className="flex  border-b border-slate-400 p-8" key={post.id}>
      <Link href={`/@${author.username}`}>
        <Image
          width={36}
          height={36}
          src={author.profileImageUrl}
          alt="pfp"
          className="h-12 w-12 rounded-full"
        />
      </Link>
      <div className="flex flex-col">
        <div className="flex text-slate-300">
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <span className="px-1">·</span>
          <Link href={`/post/${post.id}`}>
            <span className="text-slate-400">
              {dayjs(post.createdAt).fromNow()}
            </span>
          </Link>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );
};

const Feed = () => {
  const {
    data: posts,
    isLoading: postIsLoading,
    error: postError,
  } = api.post.getAll.useQuery();

  if (postIsLoading) return <LoadingPage />;

  if (postError)
    return (
      <div className="absolute top-0 right-0 flex h-screen w-screen items-center justify-center">
        Failed to load posts
      </div>
    );

  return (
    <div className="flex flex-col">
      {posts?.map(({ post, author }) => (
        <PostView key={post.id} post={post} author={author} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { user, isLoaded: userIsLoaded, isSignedIn } = useUser();

  // start loading posts immediately
  api.post.getAll.useQuery();

  if (!userIsLoaded) return <div />;

  return (
    <PageLayout>
      <div className="flex border-b border-slate-400 p-4">
        {isSignedIn && <CreatePostWizard />}
        {!isSignedIn && <SignInButton />}
      </div>
      <Feed />
    </PageLayout>
  );
};

export default Home;
