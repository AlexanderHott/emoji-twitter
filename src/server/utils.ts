import { type User } from "@clerk/nextjs/api";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

export const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
  };
};

export const generateSSGHelper = () => {
  return createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma: prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });
};
