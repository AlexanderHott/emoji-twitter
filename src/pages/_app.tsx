import { type AppType } from "next/app";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
    console.log("node env", process.env.NODE_ENV)
    return (
        <ClerkProvider {...pageProps}>
            <Head>
                <title>Emoji Twitter</title>
                <meta name="description" content="🗿🗿🗿" />
                <meta name="og:title" content="Emoji Twitter" />
                <meta
                    name="og:image"
                    content="https://emoji-twitter-seven.vercel.app/api/og"
                />
                <meta
                    name="og:image:secure_url"
                    content="https://emoji-twitter-seven.vercel.app/api/og"
                />
                <meta name="og:description" content="🗿🗿🗿" />
                <meta name="og:url" content="https://emoji-twitter-seven.vercel.app/" />
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Toaster position="bottom-center" />
            {process.env.NODE_ENV === "development" && <div className=" text-xl text-center py-2 bg-gradient-to-r from-blue-600 to-violet-600">⚠️ Dev Build ⚠️</div>}
            <Component {...pageProps} />
            <ReactQueryDevtools />
        </ClerkProvider>
    );
};

export default api.withTRPC(MyApp);
