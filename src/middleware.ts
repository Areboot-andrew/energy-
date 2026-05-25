import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "ADMIN";
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

    const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard");

    if (isAdminPage && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (isDashboardPage && !token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { matcher: ["/admin/:path*", "/dashboard/:path*"] };
