import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
import { type RouterOutputs } from "~/utils/api";

dayjs.extend(relativeTime);
type PostWithUser = RouterOutputs["post"]["getAll"][number];
export const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div className="flex border-b border-slate-400 p-4" key={post.id}>
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
