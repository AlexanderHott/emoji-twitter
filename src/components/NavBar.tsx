import Link from "next/link";
import { Button } from "./ui/Button";
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

export const NavBar = () => {
  return (
    <div className="flex justify-between border-b border-slate-400 px-4 py-2">
      <Link href="/" className="text-3xl">
        🗿
      </Link>
      <SignedIn>
        <SignOutButton>
          <Button variant={"outline"}>Sign Out</Button>
        </SignOutButton>
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <Button>Sign In</Button>
        </SignInButton>
      </SignedOut>
    </div>
  );
};
