import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
import { api, type RouterOutputs } from "~/utils/api";
import { HeartIcon } from "@heroicons/react/24/outline"

dayjs.extend(relativeTime);
type PostWithUser = RouterOutputs["post"]["getAll"][number];
export const PostView = (props: PostWithUser) => {
    const { post, author } = props;
    const utils = api.useContext();

    const { mutate: like } = api.post.like.useMutation({
        onMutate: ({ postId }) => {
            console.log("liking post id", postId);

            const prevPosts = utils.post.getAll.getData();
            console.log("prev posts", prevPosts);
            if (prevPosts) {
                const prevPostsCopy = prevPosts.map(p => {
                    if (p.post.id === postId) {
                        return {
                            ...p,
                            post: {
                                ...p.post,
                                userLikes: [...p.post.userLikes, { createdAt: new Date(), postId, userId: "1" }]
                            }
                        };
                    }
                    return p
                })
                utils.post.getAll.setData(undefined, prevPostsCopy)
            }
            return { prevPosts }
        },
        onSettled: () => {
            void utils.post.invalidate();
        },
        onError: (err, { postId }, ctx) => {
            console.log("Error liking post", err, "postId", postId);
            utils.post.getAll.setData(undefined, ctx?.prevPosts)
        }
    })

    const { mutate: unlike } = api.post.unlike.useMutation({
        onMutate: ({ postId }) => {
            console.log("liking post id", postId);

            const prevPosts = utils.post.getAll.getData();
            console.log("prev posts", prevPosts);
            if (prevPosts) {
                const prevPostsCopy = prevPosts.map(p => {
                    if (p.post.id === postId) {
                        return {
                            ...p,
                            post: {
                                ...p.post,
                                userLikes: []
                            }
                        };
                    }
                    return p
                })
                utils.post.getAll.setData(undefined, prevPostsCopy)
            }
            return { prevPosts }
        },
        onSettled: () => {
            void utils.post.invalidate();
        },
        onError: (err, { postId }, ctx) => {
            console.log("Error unliking post", err, "postId", postId);
            utils.post.getAll.setData(undefined, ctx?.prevPosts)
        }
    })


    const hasLiked = post.userLikes.length > 0;

    return (
        <div className="flex border-b border-slate-400 p-4 gap-1" key={post.id}>
            <Link href={`/@${author.username}`}>
                <Image
                    width={36}
                    height={36}
                    src={author.profileImageUrl}
                    alt="pfp"
                    className="h-12 w-12 rounded-full"
                />
            </Link>
            <div className="flex flex-col w-full">
                <div className="flex text-slate-300">
                    <Link className="hover:underline" href={`/@${author.username}`}>
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
                <div className="pt-2 flex">
                    <div className="flex" onClick={() => {
                        if (hasLiked) {
                            unlike({ postId: post.id })
                        } else {
                            like({ postId: post.id })
                        }
                    }}>
                        <HeartIcon width={24} height={24} color={hasLiked ? "red" : "white"} />
                        <span>{post.userLikes.length}</span>
                    </div>
                </div>
            </div>

        </div >
    );
};
