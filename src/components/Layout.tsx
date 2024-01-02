import Link from "next/link";
import { HomeIcon, SparklesIcon, UserIcon } from "@heroicons/react/24/outline";
// import { SignedIn } from "@clerk/nextjs";
// import { useUser } from "@clerk/nextjs";

export const PageLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // const { user } = useUser();
  return (
    <main className="flex h-screen justify-center">
      <aside className="hidden flex-col gap-4 p-4 md:flex">
        <Link href="/" className="flex gap-2">
          <HomeIcon height={24} width={24} />
          <span className="text-xl">Home</span>
        </Link>
        <Link href="/feed" className="flex gap-2">
          <SparklesIcon height={24} width={24} />
          <span className="text-xl">Your Feed</span>
        </Link>
        {/*<SignedIn>
          <Link href={`/@${user?.username || ""}`} className="flex gap-2">
            <UserIcon height={24} width={24} />
            <span className="text-xl">Profile</span>
          </Link>
        </SignedIn>*/}
      </aside>
      <div className="h-max w-full border-x border-slate-400 md:max-w-2xl">
        {children}
      </div>
      <div />
    </main>
  );
};
