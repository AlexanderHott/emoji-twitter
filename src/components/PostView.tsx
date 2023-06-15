import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
import { api, type RouterOutputs } from "~/utils/api";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useUser, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog";
import { Button } from "./ui/Button";

dayjs.extend(relativeTime);
type PostWithUser = RouterOutputs["post"]["getAll"][number];
export const PostView = (props: PostWithUser) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { post, author } = props;
  const utils = api.useContext();

  const { mutate: like } = api.post.like.useMutation({
    // onMutate: ({ postId }) => {
    //     console.log("liking post id", postId);
    //
    //     const prevPosts = utils.post.getAll.getData();
    //     console.log("prev posts", prevPosts);
    //     if (prevPosts) {
    //         const newPosts = prevPosts.map(p => {
    //             if (p.post.id === postId) {
    //                 console.log("setting likes to ", p.post._count.userLikes + 1)
    //                 return {
    //                     ...p,
    //                     post: {
    //                         ...p.post,
    //                         userLikes: [...p.post.userLikes, { userId: "1" }]
    //                     },
    //                     _count: { userLikes: p.post._count.userLikes + 1 }
    //                 };
    //             }
    //             return p
    //         })
    //         utils.post.getAll.setData(undefined, newPosts)
    //         console.log("new posts ", newPosts);
    //     }
    //     return { prevPosts }
    // },
    onSettled: () => {
      void utils.post.invalidate();
    },
    // onError: (err, { postId }, ctx) => {
    //     console.log("Error liking post", err, "postId", postId);
    //     utils.post.getAll.setData(undefined, ctx?.prevPosts)
    // }
  });

  const { mutate: unlike } = api.post.unlike.useMutation({
    // onMutate: ({ postId }) => {
    //     console.log("unliking post id", postId);
    //
    //     const prevPosts = utils.post.getAll.getData();
    //     console.log("prev posts", prevPosts);
    //     if (prevPosts) {
    //         const prevPostsCopy = prevPosts.map(p => {
    //             if (p.post.id === postId) {
    //                 return {
    //                     ...p,
    //                     post: {
    //                         ...p.post,
    //                         userLikes: []
    //                     },
    //                     _count: { userLikes: p.post._count.userLikes - 1 }
    //                 };
    //             }
    //             return p
    //         })
    //         utils.post.getAll.setData(undefined, prevPostsCopy)
    //     }
    //     return { prevPosts }
    // },
    onSettled: () => {
      void utils.post.invalidate();
    },
    // onError: (err, { postId }, ctx) => {
    //     console.log("Error unliking post", err, "postId", postId);
    //     utils.post.getAll.setData(undefined, ctx?.prevPosts)
    // }
  });

  const hasLiked = post.userLikes.length > 0;

  if (!isLoaded) return null;

  return (
    <div className="flex gap-1 border-b border-slate-400 p-4" key={post.id}>
      <Link href={`/@${author.username}`} className="shrink-0">
        <Image
          width={36}
          height={36}
          src={author.profileImageUrl}
          alt="pfp"
          className="h-9 w-9 rounded-full"
        />
      </Link>
      <div className="flex w-full flex-col overflow-auto">
        <div className="flex text-slate-300">
          <Link className="hover:underline" href={`/@${author.username}`}>
            <span className="font-bold">{`@${author.username}`}</span>
          </Link>
          <span className="px-1">·</span>
          <Link href={`/post/${post.id}`}>
            <span className="text-slate-400">
              {dayjs(post.createdAt).fromNow()}
            </span>
          </Link>
        </div>
        <span className="text-2xl break-words">{post.content}</span>
        <div className="flex pt-2">
          <SignedIn>
            <div
              className="flex cursor-pointer"
              onClick={() => {
                if (hasLiked) {
                  unlike({ postId: post.id });
                } else {
                  like({ postId: post.id });
                }
              }}
            >
              <HeartIcon
                width={24}
                height={24}
                color={hasLiked ? "red" : "white"}
              />
              <span>{post._count.userLikes}</span>
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <div
                className="flex cursor-pointer"
                onClick={() => {
                  if (hasLiked) {
                    unlike({ postId: post.id });
                  } else {
                    like({ postId: post.id });
                  }
                }}
              >
                <HeartIcon
                  width={24}
                  height={24}
                  color={hasLiked ? "red" : "white"}
                />
                <span>{post._count.userLikes}</span>
              </div>
            </SignInButton>
          </SignedOut>
          {/* {!isSignedIn && (
            <Dialog>
              <DialogTrigger className="flex">
                <HeartIcon
                  width={24}
                  height={24}
                  color={hasLiked ? "red" : "white"}
                />
                <span>{post._count.userLikes}</span>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Please Log In</DialogTitle>
                  <DialogDescription className="flex items-center justify-between">
                    You must be logged in to like posts.
                    <Button variant="default" onClick={() => {}}>
                      Sign In
                    </Button>
                    <SignInButton />
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )} */}
        </div>
      </div>
    </div>
  );
};
