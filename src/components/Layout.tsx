import Link from "next/link";
import { HomeIcon, SparklesIcon } from "@heroicons/react/24/outline";

export const PageLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <main className="flex h-screen justify-center">
      <aside className="flex-col hidden md:flex p-4 gap-4">
        <Link href="/" className="flex gap-2">
          <HomeIcon height={24} width={24} />
          <span className="text-xl">Home</span>
        </Link>
        <Link href="/feed" className="flex gap-2">
          <SparklesIcon height={24} width={24} />
          <span className="text-xl">Your Feed</span>
        </Link>
      </aside>
      <div className="h-max w-full border-x border-slate-400 md:max-w-2xl">
        {children}
      </div>
      <div />
    </main>
  );
};
