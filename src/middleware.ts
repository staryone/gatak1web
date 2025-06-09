import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/firebase";

export async function middleware(request: NextRequest) {
  const user = await new Promise((resolve) => {
    auth.onAuthStateChanged((user) => resolve(user));
  });

  if (!user && request.nextUrl.pathname.startsWith("/joko")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
