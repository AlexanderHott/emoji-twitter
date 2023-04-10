import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { PageLayout } from "~/components/Layout";
import { LoadingPage } from "~/components/Loading";
import { PostView } from "~/components/PostView";
import { postSchema } from "~/schemas/post";
import { api } from "~/utils/api";

const CreatePostWizard = () => {
    const { user } = useUser();
    const utils = api.useContext();
    const { mutate, isLoading: isPosting } = api.post.create.useMutation({
        onMutate: ({ content }) => {
            utils.post.getAll.setData(undefined, (old) => {
                if (!old) return old;
                if (!user || !user.username || !user.profileImageUrl) return old;
                if (!postSchema.safeParse({ content }).success) return old;
                setContent("");
                return [
                    {
                        post: {
                            id: Math.random().toString(),
                            content,
                            createdAt: new Date(),
                            authorId: user.id,
                            likes: 0,
                            userLikes: [],
                            _count: { userLikes: 0 }
                        },
                        author: {
                            id: user.id,
                            username: user.username,
                            profileImageUrl: user.profileImageUrl,
                        },
                    },
                    ...old
                ]

            });

        },
        // onSuccess: () => {
        //     setContent("");
        //     void utils.post.getAll.invalidate();
        // },
        onSettled: () => utils.post.getAll.invalidate(),
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

    if (!user) {
        return null;
    }

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
                    if (e.key === "Enter") {
                        e.preventDefault();
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
    const { isLoaded: userIsLoaded, isSignedIn } = useUser();

    // start loading posts immediately
    api.post.getAll.useQuery();
    if (!userIsLoaded) return null;

    return (
        <PageLayout>
            <div className="flex border-b border-slate-400 p-4">
                {isSignedIn && <CreatePostWizard />}
                {isSignedIn && <SignOutButton />}
                {!isSignedIn && <SignInButton />}
            </div>
            <Feed />
        </PageLayout>
    );
};

export default Home;
