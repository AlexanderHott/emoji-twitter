// import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Image from "next/image";
import { useState } from "react";
import { ZodError, z } from "zod";
import { toast } from "react-hot-toast";
import { PageLayout } from "~/components/Layout";
import { LoadingPage } from "~/components/Loading";
// import { PostView } from "~/components/PostView";
import { PostView } from "~/components/museum/PostView";
import { Button } from "~/components/ui/Button";
import { POSTS, type Post } from "~/data/data";
// import { postSchema } from "~/schemas/post";
// import { api } from "~/utils/api";

export const CreatePostWizard = ({
  setPosts,
}: {
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}) => {
  // const { user } = useUser();
  // const utils = api.useContext();
  // const { mutate, isLoading: isPosting } = api.post.create.useMutation({
  //   onMutate: ({ content }) => {
  //     utils.post.getAll.setData(undefined, (old) => {
  //       if (!old) return old;
  //       if (!user || !user.username || !user.profileImageUrl) return old;
  //       if (!postSchema.safeParse({ content }).success) return old;
  //       setContent("");
  //       return [
  //         {
  //           post: {
  //             id: Math.random().toString(),
  //             content,
  //             createdAt: new Date(),
  //             authorId: user.id,
  //             likes: 0,
  //             userBites: [],
  //             userLikes: [],
  //             _count: { userLikes: 0, userBites: 0 },
  //             originalAuthorId: null,
  //             originalPostId: null,
  //             repostCount: 0,
  //           },
  //           author: {
  //             id: user.id,
  //             username: user.username,
  //             profileImageUrl: user.profileImageUrl,
  //           },
  //           originalAuthor: undefined,
  //         },
  //         ...old,
  //       ];
  //     });
  //   },
  // onSuccess: () => {
  //     setContent("");
  //     void utils.post.getAll.invalidate();
  // },
  //   onSettled: () => utils.post.getAll.invalidate(),
  //   onError: (err) => {
  //     if (
  //       err.data?.zodError?.fieldErrors.content &&
  //       err.data?.zodError?.fieldErrors.content[0]
  //     ) {
  //       toast.error(err.data?.zodError?.fieldErrors.content[0]);
  //     } else {
  //       toast.error(err.message);
  //     }
  //   },
  // });
  const [content, setContent] = useState("");

  // if (!user) {
  //   return null;
  // }
  const postSchema = z
    .string()
    .min(1, "you must have at least 1 emoji")
    .emoji("Post must only contain emojis");
  type PostSchema = z.infer<typeof postSchema>;
  const post = () => {
    try {
      postSchema.parse(content);
    } catch (error) {
      if (error instanceof ZodError) {
        toast.error(error.issues[0]?.message ?? "");
        return;
      }
    }
    setPosts((ps) => [
      {
        content,
        id: String(Math.random()),
        bites: 0,
        likes: 0,
        author: {
          following: 0,
          followers: 0,
          username: "you",
          id: "0",
          createdAt: 0,
          updatedAt: 0,
          lastSignInAt: 0,
          externalAccounts: { provider: "local" },
          profileImageUrl:
            "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yTlFMTFRlNFlidWwydXg3d2JBTHVLME5FaUciLCJyaWQiOiJ1c2VyXzJOcXNadHp2UG1Pc2RTbXFTZ2UwaGhPVDdaTiIsImluaXRpYWxzIjoiUlYifQ",
        },
        reposts: 0,
        authorId: "0",
        createdAt: new Date().toString(),
        originalAuthor: undefined,
        originalPostId: null,
        originalAuthorId: null,
      },
      ...ps,
    ]);
    setContent("");
  };

  return (
    <div className="flex w-full items-center gap-3">
      <Image
        width={56}
        height={56}
        src={
          "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yTlFMTFRlNFlidWwydXg3d2JBTHVLME5FaUciLCJyaWQiOiJ1c2VyXzJOcXNadHp2UG1Pc2RTbXFTZ2UwaGhPVDdaTiIsImluaXRpYWxzIjoiUlYifQ"
        }
        alt="pfp"
        className="h-14 w-14 rounded-full"
      />
      <input
        placeholder="Type some emojis"
        className="grow bg-transparent outline-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={false}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            console.log("posting", content);
            e.preventDefault();
            post();
            // mutate({ content });
          }
        }}
      />
      <Button
        variant="ghost"
        disabled={false}
        // onClick={() => mutate({ content })}
        onClick={() => post()}
      >
        Post
      </Button>
    </div>
  );
};

const Feed = ({ posts }: { posts: Post[] }) => {
  // const {
  //   data: posts,
  //   isLoading: postIsLoading,
  //   error: postError,
  // } = api.post.getAll.useQuery();
  const postIsLoading = false;
  const postError = null;

  if (postIsLoading) return <LoadingPage />;

  if (postError) {
    return (
      <div className="absolute right-0 top-0 flex h-screen w-screen items-center justify-center">
        Failed to load posts
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {posts.map((post) => (
        <PostView key={post.id} {...post} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  // const { isLoaded: userIsLoaded, isSignedIn } = useUser();

  // start loading posts immediately
  // api.post.getAll.useQuery();
  // if (!userIsLoaded) return null;
  const [posts, setPosts] = useState(POSTS);

  return (
    <PageLayout>
      {true && (
        <div className="flex border-b border-slate-400 p-4">
          <CreatePostWizard setPosts={setPosts} />
        </div>
      )}
      <Feed posts={posts} />
    </PageLayout>
  );
};

export default Home;
