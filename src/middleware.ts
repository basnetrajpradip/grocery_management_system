import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) return NextResponse.redirect(new URL("/login", request.url));

  switch (token.role) {
    case "ADMIN":
      if (!request.nextUrl.pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      break;
    case "USER":
      if (!request.nextUrl.pathname.startsWith("/user")) {
        return NextResponse.redirect(new URL("/user", request.url));
      }
      break;
    default:
      return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.png|login|signup|products|users).*)"],
};
