import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Proxy configuration placeholder
  // const url = request.nextUrl;
  // if (url.pathname.startsWith('/api/proxy')) {
  //   return NextResponse.rewrite(new URL(url.pathname, 'https://target-api.com'));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
