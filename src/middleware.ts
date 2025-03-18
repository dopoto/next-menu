import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { getValidPriceTier } from "./app/_utils/price-tier-utils";
import { env } from "./env";

const redirectTo = (route: string) =>
  NextResponse.redirect(new URL(`${env.NEXT_PUBLIC_APP_URL}${route}`));
const isSignUpRoute = createRouteMatcher(["/sign-up"]);
const isSignOutRoute = createRouteMatcher(["/sign-out(.*)"]);
const isMyRoute = createRouteMatcher(["/my(.*)"]);
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-out(.*)",
  "/onboard/select-plan(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(
  async (auth, req: NextRequest) => {
    const { userId, sessionClaims, redirectToSignIn } = await auth();
    const { currentLocationId } = sessionClaims?.metadata ?? {};
    const orgId = sessionClaims?.org_id;

    if (isSignUpRoute(req)) {
      console.log(`DBG-MIDDLEWARE [${req.url}] Is sign-up route`);
      const url = new URL(req.url);
      const tierParam = url.searchParams.get("tier") ?? "";
      if (getValidPriceTier(tierParam)) {
        console.log(
          `DBG-MIDDLEWARE [${req.url}] Setting onboard-plan cookie to ${tierParam}`,
        );
        const res = NextResponse.next();
        res.cookies.set("onboard-plan", tierParam, {
          path: "/",
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
        });
        return res;
      } else {
        console.log(
          `DBG-MIDDLEWARE [${req.url}] Not a valid price tier: ${tierParam}. Redirect to /onboard/select-plan`,
        );
        return redirectTo(`/onboard/select-plan`);
      }
    }

    // If user wants to sign out, let them
    if (isSignOutRoute(req)) {
      return NextResponse.next();
    }

    // If the user isn't signed in and the route is private, redirect to sign-in
    if (!userId && !isPublicRoute(req)) {
      console.log(
        `DBG-MIDDLEWARE [${req.url}] Not public and no user id found => Redirecting to sign in`,
      );
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    // If the user is signed in and accessing the /my route, redirect them
    // to their actual dashboard URL if possible.
    if (userId && isMyRoute(req)) {
      if (!currentLocationId || !orgId) {
        console.log(
          `DBG-MIDDLEWARE [/my] Not onboarded yet, redirecting to /onboard/add-org. currentLocationId: ${currentLocationId}, orgId: ${orgId}`,
        );
        return redirectTo(`/onboard/add-org`);
      }

      const myDashboardRoute = `/${currentLocationId}/live`;
      console.log(
        `DBG-MIDDLEWARE [/my] Redirecting from ${req.url} to ${myDashboardRoute}`,
      );
      return redirectTo(`/my`);
    }

    // If the user is logged in and the route is protected, let them use it.
    if (userId && !isPublicRoute(req)) return NextResponse.next();
  },
  //{ debug: env.NEXT_PUBLIC_ENV === 'development' },
  { debug: false },
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
