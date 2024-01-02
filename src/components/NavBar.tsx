import Link from "next/link";
// import {
//   SignedIn,
//   SignedOut,
//   SignInButton,
//   SignOutButton,
//   useUser,
// } from "@clerk/nextjs";
import {
  Bars3Icon,
  HomeIcon,
  SparklesIcon,
  // UserIcon,
} from "@heroicons/react/24/outline";

export const NavBar = () => {
  return (
    <div className="flex justify-between border-b border-slate-400 px-4 py-2">
      <Link href="/" className="text-3xl">
        🗿
      </Link>
      <div className="flex items-center gap-4">
        {/*gnedIn>
          <SignOutButton>
            <Button variant={"outline"}>Sign Out</Button>
          </SignOutButton>
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <Button>Sign In</Button>
          </SignInButton>
        </SignedOut>*/}
        <Button>Sign In</Button>
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </div>
  );
};

import { Button } from "./ui/Button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "./ui/Sheet";
import { Separator } from "./ui/Separator";
import { GithubIcon } from "lucide-react";
import { USER_MAP } from "~/data/data";
import { useSearchParams } from "next/navigation";

export function MobileNav() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  if (!userId) return <div>404</div>;
  const user = USER_MAP.get(userId);
  if (!user) return <div>404</div>;
  // const { user } = useUser();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="square">
          <Bars3Icon height={24} width={24} />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-black opacity-80">
        <div className="grid gap-4 py-4">
          <SheetClose asChild>
            <Link href="/" className="flex gap-2">
              <HomeIcon height={24} width={24} />
              <span className="text-xl">Home</span>
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/feed" className="flex gap-2">
              <SparklesIcon height={24} width={24} />
              <span className="text-xl">Your Feed</span>
            </Link>
          </SheetClose>
          {/*<SignedIn>
            <SheetClose asChild>
              <Link href={`/@${user?.username || ""}`} className="flex gap-2">
                <UserIcon height={24} width={24} />
                <span className="text-xl">Profile</span>
              </Link>
            </SheetClose>
          </SignedIn>*/}
        </div>
        <Separator className="my-4 bg-white" />
        <SheetFooter>
          <Link
            href="https://github.com/AlexanderHOtt/emoji-twitter"
            target="_blank"
          >
            <GithubIcon />
          </Link>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
