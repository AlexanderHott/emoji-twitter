import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs/server";
import {
  // protectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import z from "zod";
import { filterUserForClient } from "~/server/utils";
import { db } from "~/db";
import { desc } from "drizzle-orm";
import { post } from "~/db/schema";

export const expRouter = createTRPCRouter({
  test: publicProcedure.query(async ({ ctx }) => {
    const posts = await db.query.post.findMany({
      orderBy: desc(post.createdAt),
    });
    return posts;
  }),
});
