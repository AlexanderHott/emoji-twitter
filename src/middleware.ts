import { authMiddleware } from "@clerk/nextjs";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export default withClerkMiddleware((_req: NextRequest) => {
//   return NextResponse.next();
// });

export default authMiddleware();

// Stop Middleware running on static files
export const config = {
  // matcher: "/((?!_next/image|_next/static|favicon.ico).*)",
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
