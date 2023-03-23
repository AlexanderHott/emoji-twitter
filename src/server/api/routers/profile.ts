import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs/server";
import {
  protectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import z from "zod";
import { filterUserForClient } from "~/server/utils";

export const profileRouter = createTRPCRouter({
  getByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
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
});
