import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user is authenticated for protected routes
        const { pathname } = req.nextUrl;

        // Allow access to auth pages and home page
        if (
          pathname.startsWith("/login") ||
          pathname.startsWith("/signup") ||
          pathname === "/"
        ) {
          return true;
        }

        // Require authentication for dashboard and other protected routes
        if (pathname.startsWith("/dashboard")) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
