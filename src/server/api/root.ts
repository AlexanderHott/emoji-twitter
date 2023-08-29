import { createTRPCRouter } from "~/server/api/trpc";
import { postsRouter } from "~/server/api/routers/posts";
import { profileRouter } from "~/server/api/routers/profile";
import { userRouter } from "~/server/api/routers/user";
import { expRouter } from "~/server/api/routers/exp";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postsRouter,
  profile: profileRouter,
  user: userRouter,
  exp: expRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
