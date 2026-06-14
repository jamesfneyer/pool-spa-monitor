import { fetchAuthSession } from "aws-amplify/auth/server";
import { NextResponse, type NextRequest } from "next/server";
import { isAmplifySandboxReady } from "@/lib/amplify/configure";
import { runWithAmplifyServerContext } from "@/lib/amplify/server";

const protectedPrefixes = [
  "/dashboard",
  "/water-tests",
  "/chemical-dosing",
  "/equipment",
  "/maintenance",
  "/notes",
  "/settings",
  "/setup",
];

function isDevAuthBypass(): boolean {
  return (
    process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === "true" &&
    (process.env.NEXT_PUBLIC_DATA_MODE ?? "mock") === "mock"
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  if (isDevAuthBypass()) {
    return NextResponse.next();
  }

  if (!isAmplifySandboxReady()) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("setup", "required");
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();

  const authenticated = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        return session.tokens !== undefined;
      } catch {
        return false;
      }
    },
  });

  if (authenticated) {
    return response;
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/water-tests/:path*",
    "/chemical-dosing/:path*",
    "/equipment/:path*",
    "/maintenance/:path*",
    "/notes/:path*",
    "/settings/:path*",
    "/setup/:path*",
  ],
};
