import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import z from "zod";

export const userRouter = createTRPCRouter({
  follow: protectedProcedure
    .input(z.object({ leaderId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.userFollows.create({
        data: {
          leaderId: input.leaderId,
          followerId: ctx.userId,
        },
      });
    }),
  unfollow: protectedProcedure
    .input(z.object({ leaderId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.userFollows.delete({
        where: {
          leaderId_followerId: {
            leaderId: input.leaderId,
            followerId: ctx.userId,
          },
        },
      });
    }),
  isFollowing: publicProcedure
    .input(z.object({ leaderId: z.string(), followerId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { leaderId, followerId } = input;
      return (
        (await ctx.prisma.userFollows.findUnique({
          where: { leaderId_followerId: { leaderId, followerId } },
        })) !== null
      );
    }),
  getFollowerIds: publicProcedure
    .input(z.object({ leaderId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.userFollows.findMany({
        where: { leaderId: input.leaderId },
      });
    }),
  getFollowingIds: publicProcedure
    .input(z.object({ followerId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.userFollows.findMany({
        where: { followerId: input.followerId },
      });
    }),
  followStats: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const followerCount = (
        await ctx.prisma.userFollows.findMany({
          where: { leaderId: input.userId },
        })
      ).length;
      const followingCount = (
        await ctx.prisma.userFollows.findMany({
          where: { followerId: input.userId },
        })
      ).length;
      const followsMe =
        (await ctx.prisma.userFollows.findUnique({
          where: {
            leaderId_followerId: {
              leaderId: ctx.userId || "",
              followerId: input.userId,
            },
          },
        })) !== null;

      const iFollow =
        (await ctx.prisma.userFollows.findUnique({
          where: {
            leaderId_followerId: {
              followerId: ctx.userId || "",
              leaderId: input.userId,
            },
          },
        })) !== null;

      return { iFollow, followsMe, followerCount, followingCount };
    }),
});
