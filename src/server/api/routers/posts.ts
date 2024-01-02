import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { type Post } from "@prisma/client";
import { postSchema } from "~/schemas/post";
import { type User } from "@clerk/nextjs/api";
import userData from "../../../data/users.json";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"), // 3 posts per 1 minute
  analytics: true,
});

export type PostWithLikeAndBite = Post & {
  userLikes: { userId: string }[];
  userBites: { userId: string }[];
  _count: {
    userLikes: number;
    userBites: number;
  };
};

const addUserDataToPosts = async (posts: PostWithLikeAndBite[]) => {
  const idToUser = new Map<string, User>();
  const userIds = posts
    .map((p) => p.authorId)
    .concat(posts.map((p) => p.originalAuthorId).filter(Boolean) as string[]);
  const users = await clerkClient.users.getUserList({
    userId: [...new Set(userIds)],
    limit: 200,
  });

  for (const user of users) {
    idToUser.set(user.id, user);
  }
  return posts.map((post) => {
    const author = idToUser.get(post.authorId) as User;
    // console.log("author", author?.id, post.authorId);
    const originalAuthor = post.originalAuthorId
      ? idToUser.get(post.originalAuthorId)
      : undefined;
    return {
      post,
      author: {
        id: author.id,
        username: author.username,
        profileImageUrl: author.profileImageUrl,
      },
      originalAuthor: originalAuthor
        ? {
            id: originalAuthor.id,
            username: originalAuthor.username,
            profileImageUrl: originalAuthor.profileImageUrl,
          }
        : undefined,
    };
  });
};

const addUserDataToPost = async (post: PostWithLikeAndBite) => {
  const author = await clerkClient.users.getUser(post.authorId);
  const originalAuthor =
    post.authorId === post.originalAuthorId
      ? author
      : post.originalAuthorId !== null
        ? await clerkClient.users.getUser(post.originalAuthorId)
        : undefined;

  return {
    post,
    author: {
      id: author.id,
      username: author.username,
      profileImageUrl: author.profileImageUrl,
    },
    originalAuthor: originalAuthor
      ? {
          id: originalAuthor.id,
          username: originalAuthor.username,
          profileImageUrl: originalAuthor.profileImageUrl,
        }
      : undefined,
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
          select: { userId: true },
        },
        userBites: {
          where: { userId: ctx.userId || undefined },
          select: { userId: true },
        },
        _count: { select: { userLikes: true, userBites: true } },
      },
    });
    return await addUserDataToPosts(posts);
  }),
  getFollowingPosts: publicProcedure
    .input(z.object({ followerId: z.string() }))
    .query(async ({ ctx, input }) => {
      const followingIds = await ctx.prisma.userFollows.findMany({
        select: { leaderId: true },
        where: { followerId: input.followerId },
      });
      console.log("fids", followingIds);
      const idArr = followingIds.map((f) => f.leaderId);
      const posts = await ctx.prisma.post.findMany({
        where: {
          authorId: { in: idArr },
        },
        take: 100,
        orderBy: { createdAt: "desc" },

        include: {
          userLikes: {
            where: { userId: ctx.userId || undefined },
            select: { userId: true },
          },
          userBites: {
            where: { userId: ctx.userId || undefined },
            select: { userId: true },
          },
          _count: { select: { userLikes: true, userBites: true } },
        },
      });
      return addUserDataToPosts(posts);
    }),
  create: protectedProcedure
    .input(postSchema)
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
  repost: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        originalAuthorId: z.string(),
        originalPostId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { content, originalAuthorId, originalPostId } = input;

      const { success } = await ratelimit.limit(ctx.userId);
      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "You are posting too fast",
        });
      }

      await Promise.all([
        await ctx.prisma.post.update({
          where: { id: originalPostId },
          data: { repostCount: { increment: 1 } },
        }),

        await ctx.prisma.post.create({
          data: {
            content,
            authorId: ctx.userId,
            originalAuthorId,
            originalPostId,
          },
        }),
      ]);
    }),
  getByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        where: { authorId: input.userId },
        orderBy: { createdAt: "desc" },
        take: 100,
        include: {
          userLikes: {
            where: { userId: ctx.userId || undefined },
            select: { userId: true },
          },
          userBites: {
            where: { userId: ctx.userId || undefined },
            select: { userId: true },
          },
          _count: { select: { userLikes: true, userBites: true } },
        },
      });

      return await addUserDataToPosts(posts);
    }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input.id },
        include: {
          userLikes: {
            where: { userId: ctx.userId || undefined },
            select: { userId: true },
          },
          userBites: {
            where: { userId: ctx.userId || undefined },
            select: { userId: true },
          },
          _count: { select: { userLikes: true, userBites: true } },
        },
      });
      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }
      return addUserDataToPost(post);
    }),
  like: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
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
            userId,
            postId,
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
  unlike: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
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
            userId,
            postId,
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
            userId,
            postId,
          },
        },
      });
    }),
  getLikedPosts: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
        limit: 1,
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      const posts = await ctx.prisma.userLikes.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
          post: {
            include: {
              userBites: {
                where: { userId: ctx.userId || undefined },
                select: { userId: true },
              },
              userLikes: {
                where: { userId: ctx.userId || undefined },
                select: { userId: true },
              },
              _count: { select: { userLikes: true, userBites: true } },
            },
          },
        },
      });
      return await addUserDataToPosts(posts.map((p) => p.post));
    }),
  bite: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
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
      const bite = await ctx.prisma.userBites.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      if (bite) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Bite already exists",
        });
      }
      await ctx.prisma.userBites.create({
        data: {
          postId,
          userId,
        },
      });
      // return addUserDataToPost(post);
    }),
  getBittenPosts: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
        limit: 1,
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      const posts = await ctx.prisma.userBites.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
          post: {
            include: {
              userBites: {
                where: { userId: ctx.userId || undefined },
                select: { userId: true },
              },
              userLikes: {
                where: { userId: ctx.userId || undefined },
                select: { userId: true },
              },
              _count: { select: { userLikes: true, userBites: true } },
            },
          },
        },
      });
      return await addUserDataToPosts(posts.map((p) => p.post));
    }),
});
