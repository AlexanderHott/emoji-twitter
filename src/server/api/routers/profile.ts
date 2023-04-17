import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs/server";
import {
  // protectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import z from "zod";
import { filterUserForClient } from "~/server/utils";

export const profileRouter = createTRPCRouter({
  getByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx: _ctx, input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });
      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }
      return filterUserForClient(user);
    }),
  getMostUsedEmojis: publicProcedure
    .input(z.object({ userId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (input.userId === undefined) return "";
      const posts = await ctx.prisma.post.findMany({
        where: {
          authorId: input.userId,
          createdAt:
            // one week ago
            { gt: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000) },
        },
      });
      let charCount = new Map();
      let maxChar = "";
      let maxCount = 0;

      for (let post of posts) {
        for (let char of post.content) {
          let count = charCount.get(char) || 0;
          charCount.set(char, count + 1);

          if (count + 1 > maxCount) {
            maxChar = char;
            maxCount = count + 1;
          }
        }
      }

      return maxChar;
    }),
});
