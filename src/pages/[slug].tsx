import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";

import dayjs from "dayjs";

import { api } from "~/utils/api";
import { LoadingPage } from "~/components/Loading";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "~/server/api/root";
import superjson from "superjson";
import { prisma } from "~/server/db";
import { PageLayout } from "~/components/Layout";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma: prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await ssg.profile.getByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getByUsername.useQuery({
    username,
  });

  if (!data) {
    return <div>404</div>;
  }

  return (
    <>
      <Head>
        <title>{username}</title>
      </Head>
      <PageLayout>
        <div className="relative h-36 border-slate-400 bg-slate-600">
          <Image
            src={data.profileImageUrl}
            alt={`${username}'s profile picture`}
            width={128}
            height={128}
            className=" absolute bottom-0 left-0 -mb-16 ml-4 rounded-full border-4 border-black bg-black"
          />
        </div>
        <div className="mt-16" />
        <div className="p-4 text-2xl font-bold">{`@${username}`}</div>
        <div className="w-full border-b border-slate-400" />
      </PageLayout>
    </>
  );
};

export default ProfilePage;
