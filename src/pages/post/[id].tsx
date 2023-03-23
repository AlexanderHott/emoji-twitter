import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";

import dayjs from "dayjs";

import { api, type RouterOutputs } from "~/utils/api";
import { LoadingPage } from "~/components/Loading";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { PageLayout } from "~/components/Layout";

const SinglePostPage: NextPage = () => {
  const { user, isLoaded: userIsLoaded, isSignedIn } = useUser();

  // start loading posts immediately
  api.post.getAll.useQuery();

  if (!userIsLoaded) return <div />;

  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <PageLayout>
        <div>Posts</div>
      </PageLayout>
    </>
  );
};

export default SinglePostPage;
