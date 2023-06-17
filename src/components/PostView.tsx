import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
import { api, type RouterOutputs } from "~/utils/api";
import {
  ArrowPathRoundedSquareIcon,
  HeartIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { type SlimUser } from "~/utils/types";
import { toast } from "react-hot-toast";

dayjs.extend(relativeTime);
type PostWithUser = RouterOutputs["post"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
  const { isLoaded } = useUser();
  const { post, author, originalAuthor } = props;
  const utils = api.useContext();

  let mainAuthor: SlimUser;
  let reposter: SlimUser | undefined;
  if (originalAuthor === undefined) {
    mainAuthor = author;
    reposter = undefined;
  } else {
    mainAuthor = originalAuthor;
    reposter = author;
  }

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

  const { mutate: repost } = api.post.repost.useMutation({
    onSettled: () => {
      void utils.post.invalidate();
    },
  });

  const hasLiked = post.userLikes.length > 0;

  if (!isLoaded) return null;

  return (
    <div
      className="flex flex-col gap-1 border-b border-slate-400 p-4"
      key={post.id}
    >
      {reposter && (
        <div className="flex items-center gap-1">
          {/* Icon needs to be 36px wide so margin left is 36 - 20 = 16px = 1rem */}
          <ArrowPathRoundedSquareIcon
            strokeWidth={2.5}
            height={20}
            width={20}
            className="ml-4 text-slate-600"
          />
          <div className="text-sm font-bold text-slate-600">
            <Link
              className="hover:underline"
              href={`/@${author.username || ""}`}
            >
              @{author.username}
            </Link>{" "}
            Reposted
            <span className="px-1">·</span>
            <Link
              href={`/post/${post.originalPostId || ""}`}
              className="hover:underline"
            >
              Original
            </Link>
          </div>
        </div>
      )}
      <div className="flex gap-1">
        <Link href={`/@${mainAuthor.username || ""}`} className="shrink-0">
          <Image
            width={36}
            height={36}
            src={mainAuthor.profileImageUrl}
            alt="pfp"
            className="h-9 w-9 rounded-full"
          />
        </Link>
        <div className="flex w-full flex-col overflow-auto">
          <div className="flex text-slate-300">
            <Link
              className="hover:underline"
              href={`/@${mainAuthor.username || ""}`}
            >
              <span className="font-bold">
                {`@${mainAuthor.username || ""}`}
              </span>
            </Link>
            <span className="px-1">·</span>
            <Link href={`/post/${post.id}`}>
              <span className="text-slate-400">
                {dayjs(post.createdAt).fromNow()}
              </span>
            </Link>
          </div>
          <span className="break-words text-2xl">{post.content}</span>
          <div className="flex gap-4 pt-2">
            <AuthButton>
              <div
                className="flex cursor-pointer gap-1 group group-hover:text-red-600"
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
                  className={hasLiked ? " text-red-600" : " text-white group-hover:text-red-600"}
                />
                <span className="group-hover:text-red-600">{post._count.userLikes}</span>
              </div>
            </AuthButton>
            <AuthButton>
              <div
                className="flex cursor-pointer gap-1 hover:text-lime-600"
                onClick={() =>
                  repost({
                    content: post.content,
                    originalAuthorId: post.originalAuthorId ?? author.id,
                    originalPostId: post.originalPostId ?? post.id,
                  })
                }
              >
                <ArrowPathRoundedSquareIcon
                  width={24}
                  height={24}
                  className=""
                />
                <span>{post.repostCount}</span>
              </div>
            </AuthButton>
            <div
              className="flex cursor-pointer"
              onClick={() => {
                void navigator.clipboard.writeText(
                  `https://${window.location.host}/post/${post.id}`
                );
                toast.success("Copied post URL to clipboard");
              }}
            >
              <ShareIcon
                width={24}
                height={24}
                className="hover:text-cyan-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <SignInButton mode="modal">{children}</SignInButton>
      </SignedOut>
    </>
  );
};
