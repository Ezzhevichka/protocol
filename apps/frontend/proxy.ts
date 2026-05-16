import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/bans"];

export function proxy(request: NextRequest) {
  const isProtected = protectedRoutes.some((path) => request.nextUrl.pathname.startsWith(path));
  if (!isProtected) return NextResponse.next();

  const hasSession = Boolean(request.cookies.get("sid"));
  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/bans/:path*"] };
