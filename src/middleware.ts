import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define admin routes
  const adminRoutes = ["/admin", "/admin/*"];
  const idToken = request.cookies.get("idToken")?.value;

  // Redirect authenticated users from /login to /admin
  if (pathname === "/login" && idToken) {
    try {
      const response = await fetch(
        `${request.nextUrl.origin}/api/verify-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        }
      );
      const data = await response.json();

      if (data.success) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    } catch {
      // If token verification fails, allow access to login page
    }
  }

  // Check if the current path is an admin route
  const isAdminRoute = adminRoutes.some((route) => {
    if (route.includes("*")) {
      const baseRoute = route.replace("/*", "");
      return pathname.startsWith(baseRoute);
    }
    return pathname === route;
  });

  if (isAdminRoute) {
    if (!idToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const response = await fetch(
        `${request.nextUrl.origin}/api/verify-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        }
      );
      const data = await response.json();

      if (!data.success) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
