import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowPathRoundedSquareIcon,
  HeartIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import type { Post, User } from "~/data/data";

dayjs.extend(relativeTime);
// type PostWithUser = RouterOutputs["post"]["getAll"][number];

export const PostView = ({
  id,
  createdAt,
  content,
  // authorId,
  likes,
  // originalAuthorId,
  originalPostId,
  bites,
  reposts,
  author,
  originalAuthor,
}: Post) => {
  let mainAuthor: User;
  let reposter: User | undefined;
  if (originalAuthor === undefined && author !== undefined) {
    mainAuthor = author;
    reposter = undefined;
  } else if (originalAuthor !== undefined) {
    mainAuthor = originalAuthor;
    reposter = author;
  } else {
    throw new Error("unreachable");
  }

  return (
    <div className="flex flex-col gap-1 border-b border-slate-400 p-4" key={id}>
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
              href={`/@${author?.username ?? ""}`}
            >
              @{author.username}
            </Link>{" "}
            Reposted
            <span className="px-1">·</span>
            <Link
              href={`/post/${originalPostId ?? ""}`}
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
            <Link href={`/post/${id}`}>
              <span className="text-slate-400">
                {dayjs(createdAt).fromNow()}
              </span>
            </Link>
          </div>
          <span className="break-words text-2xl">{content}</span>
          <div className="flex gap-4 pt-2">
            <AuthButton>
              <div className="group flex cursor-pointer gap-1 group-hover:text-red-600">
                <HeartIcon
                  width={24}
                  height={24}
                  className={
                    likes > 0
                      ? " text-red-600"
                      : " text-white group-hover:text-red-600"
                  }
                />
                <span className="group-hover:text-red-600">{likes}</span>
              </div>
            </AuthButton>
            <AuthButton>
              <div className="group flex cursor-pointer gap-1 group-hover:text-yellow-500">
                {bites > 0 ? (
                  <Image
                    src="/bitten.png"
                    alt="bitten"
                    height={28}
                    width={28}
                    className="w-auto"
                  />
                ) : (
                  <Image src="/bite.png" alt="bite" height={28} width={28} />
                )}
                <span className="group-hover:text-yellow-500">{bites}</span>
              </div>
            </AuthButton>
            <AuthButton>
              <div className="flex cursor-pointer gap-1 hover:text-lime-600">
                <ArrowPathRoundedSquareIcon
                  width={24}
                  height={24}
                  className=""
                />
                <span>{reposts}</span>
              </div>
            </AuthButton>
            <div
              className="flex cursor-pointer"
              onClick={() => {
                void navigator.clipboard.writeText(
                  `https://${window.location.host}/post/${id}`,
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
  return <>{children}</>;
};
