import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { getValidPriceTier } from "./app/_utils/price-tier-utils";
import { CookieKey } from "./app/_domain/cookies";
import { ROUTES } from "./app/_domain/routes";

const redirectTo = (req: NextRequest, route: string) =>
  NextResponse.redirect(new URL(route, req.url));
const isSignUpRoute = createRouteMatcher([ROUTES.signUp]);
const isSignOutRoute = createRouteMatcher([`${ROUTES.signOut}(.*)`]);
const isMyRoute = createRouteMatcher([`${ROUTES.my}(.*)`]);
const isPublicRoute = createRouteMatcher([
  ROUTES.home,
  `${ROUTES.signIn}(.*)`,
  `${ROUTES.signOut}(.*)`,
  `${ROUTES.onboardSelectPlan}(.*)`,
  `${ROUTES.signUp}(.*)`,
  `${ROUTES.public}(.*)`,
  `/ingest/(.*)`,
]);

export default clerkMiddleware(
  async (auth, req: NextRequest) => {
    const { userId, sessionClaims, redirectToSignIn } = await auth();
    const { currentLocationId } = sessionClaims?.metadata ?? {};
    const orgId = sessionClaims?.org_id;

    const res = NextResponse.next();

    if (isSignUpRoute(req)) {
      console.log(`DBG-MIDDLEWARE [${req.url}] Is sign-up route`);
      const url = new URL(req.url);
      const tierParam = url.searchParams.get("tier") ?? "";
      if (getValidPriceTier(tierParam)) {
        console.log(
          `DBG-MIDDLEWARE [${req.url}] Setting onboard-plan cookie to ${tierParam}`,
        );
        res.cookies.set(CookieKey.OnboardPlan, tierParam, {
          path: "/",
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
        });
        return res;
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
        return redirectTo(req, `/onboard/add-org`);
      }
      //TODO validate currentLocationId
      const myDashboardRoute = ROUTES.live(Number(currentLocationId));
      console.log(
        `DBG-MIDDLEWARE [/my] Redirecting from ${req.url} to ${myDashboardRoute}`,
      );
      return redirectTo(req, myDashboardRoute);
    }

    // For public routes, ensure we have a machineId cookie
    if (isPublicRoute(req)) {
      const machineId = req.cookies.get(CookieKey.MachineId);
      if (!machineId) {
        res.cookies.set(CookieKey.MachineId, crypto.randomUUID(), {
          path: "/",
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
        });
        return res;
      }
    }

    // If the user is logged in and the route is protected, let them use it.
    if (userId && !isPublicRoute(req)) return NextResponse.next();
  },
  //{ debug: env.NEXT_PUBLIC_ENV === "development" },
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
