import {
    protectedProcedure,
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { filterUserForClient } from "~/server/utils";
// import { type UserLikes, type Post } from "@prisma/client";
import { type Post } from "@prisma/client";
import { postSchema } from "~/schemas/post";

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(3, "1 m"), // 3 posts per 1 minute
    analytics: true,
});

export type PostWithLike = (Post & {
    userLikes: { userId: string }[];
    _count: {
        userLikes: number;
    };
});

const addUserDataToPosts = async (posts: PostWithLike[]) => {
    console.log("adding data to posts");
    const users = (
        await clerkClient.users.getUserList({
            userId: posts.map((post) => post.authorId),
            limit: 100,
        })
    ).map(filterUserForClient);

    console.log("User count", users.length);

    return posts.map((post) => {
        const author = users.find((user) => user.id === post.authorId);
        if (!author || !author.username) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Author ${author?.id || ''} not found on post ${post.id}`,
            });
        }
        return {
            post,
            author: {
                id: author.id,
                username: author.username,
                profileImageUrl: author.profileImageUrl,
            },
            // _count: post._count,
        };
    });
};

const addUserDataToPost = async (post: PostWithLike) => {
    const [author] = (
        await clerkClient.users.getUserList({
            userId: [post.authorId],
            limit: 100,
        })
    ).map(filterUserForClient);

    if (!author || !author.username) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Author ${author?.id || ''} not found on post ${post.id}`,
        });
    }

    return {
        post,
        author: {
            id: author.id,
            username: author.username,
            profileImageUrl: author.profileImageUrl,
        },
        // _count: post._count,
    };
};

export const postsRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        const posts = await ctx.prisma.post.findMany({
            take: 100,
            orderBy: { createdAt: "desc" },
            include: {
                userLikes: {
                    where: { userId: ctx.userId || undefined },
                    select: { userId: true }
                },
                _count: { select: { userLikes: true } },
            }
        });
        // console.log("Posts", JSON.stringify(posts, null, 2));

        return await addUserDataToPosts(posts);
    }),
    create: protectedProcedure
        .input(
            postSchema
        )
        .mutation(async ({ ctx, input }) => {
            const authorId = ctx.userId;

            const { success } = await ratelimit.limit(authorId);

            if (!success) {
                throw new TRPCError({
                    code: "TOO_MANY_REQUESTS",
                    message: "You are posting too fast",
                });
            }

            const post = await ctx.prisma.post.create({
                data: { authorId, content: input.content },
            });

            return post;
        }),
    getByUserId: publicProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.prisma.post
                .findMany({
                    where: { authorId: input.userId },
                    orderBy: { createdAt: "desc" },
                    take: 100,
                    include: {
                        userLikes: true, _count: { select: { userLikes: true } },
                    }
                })
                .then(addUserDataToPosts);
        }),
    getById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const post = await ctx.prisma.post.findUnique({
                where: { id: input.id },
                include: {
                    userLikes: {
                        where: { userId: ctx.userId || undefined },
                        select: { userId: true }
                    },
                    _count: { select: { userLikes: true } },
                }
            });
            console.log("post by id", post, "userid", ctx.userId);
            if (!post) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Post not found",
                });
            }
            return addUserDataToPost(post);
        }),
    like: protectedProcedure.input(z.object({ postId: z.string() })).mutation(async ({ ctx, input }) => {
        const { postId } = input;
        const userId = ctx.userId;
        const post = await ctx.prisma.post.findUnique({
            where: { id: postId },
        });
        if (!post) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Post not found",
            });
        }
        const like = await ctx.prisma.userLikes.findUnique({
            where: {
                userId_postId: {
                    userId, postId
                },
            },
        });
        if (like) {
            throw new TRPCError({
                code: "CONFLICT",
                message: "Like already exists",
            });
        }
        await ctx.prisma.userLikes.create({
            data: {
                postId,
                userId,
            },
        });
        // return addUserDataToPost(post);
    }),
    unlike: protectedProcedure.input(z.object({ postId: z.string() })).mutation(async ({ ctx, input }) => {

        const { postId } = input;
        const userId = ctx.userId;
        const post = await ctx.prisma.post.findUnique({
            where: { id: postId },
        });
        if (!post) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Post not found",
            });
        }
        const like = await ctx.prisma.userLikes.findUnique({
            where: {
                userId_postId: {
                    userId, postId
                },
            },
        });

        if (!like) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Like not found",
            });
        }

        await ctx.prisma.userLikes.delete({
            where: {
                userId_postId: {
                    userId, postId
                },
            },
        });
    }),
    getLikedPosts: protectedProcedure.input(z.object({ userId: z.string() })).query(async ({ ctx, input }) => {
        const posts = await ctx.prisma.userLikes.findMany({
            where: { userId: input.userId },
            include: {
                post: {
                    include: {
                        userLikes: {
                            where: { userId: ctx.userId || undefined },
                            select: { userId: true }
                        },
                        _count: { select: { userLikes: true } },
                    }
                }
            }
        });
        return await addUserDataToPosts(posts.map(p => p.post));
    }),
    addRepost: protectedProcedure.input(z.object({ userId: z.string(), postId: z.string() })).mutation(async ({ ctx, input }) => {
        const { userId, postId } = input;
        await ctx.prisma.repost.create({ data: { userId, postId } })
    }),
    removeRepost: protectedProcedure.input(z.object({ userId: z.string(), postId: z.string() })).mutation(async ({ ctx, input }) => {
        const { userId, postId } = input;
        await ctx.prisma.repost.delete({ where: { userId_postId: { userId, postId } } })
    }),
    reposts: publicProcedure.input(z.object({ userId: z.string() })).query(async ({ ctx, input }) => {
        return await ctx.prisma.repost
            .findMany({
                where: { userId: input.userId },
                orderBy: { createdAt: "desc" },
                take: 100,
                include: {
                    post: { include: { userLikes: true, _count: { select: { userLikes: true } } } }
                }
            })
    }),
    postsAndReposts: publicProcedure.input(z.object({ userId: z.string() })).query(async ({ ctx, input }) => {
        return ctx.prisma.$queryRaw<{ content: string, authorId: string, likes: number, createdAt: Date }[]>`
            SELECT content, authorId, likes, createdAt 
            FROM Post 
            WHERE authorId=${input.userId} 
            UNION ALL 
            SELECT p.content, p.authorId, p.likes, r.createdAt 
            FROM Post p 
            JOIN Repost r on (
                p.id = r.PostId AND r.userId = ${input.userId}
            )
            ORDER BY createdAt;        `
    }),
})
