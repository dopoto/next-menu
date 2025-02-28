import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

const isSignOutRoute = createRouteMatcher(["/sign-out(.*)"]);
const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);
const isMyRoute = createRouteMatcher(["/my"]);
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-out(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();
  const { currentLocationId } = sessionClaims?.metadata ?? {};
  const orgId = sessionClaims?.org_id;

  // If user wants to sign out, let them
  if (isSignOutRoute(req)) {
    return NextResponse.next();
  }

  // If user is already signed up and visiting /onboarding/*, don't try to redirect
  if (userId && isOnboardingRoute(req)) {
    return NextResponse.next();
  }

  // If the user isn't signed in and the route is private, redirect to sign-in
  if (!userId && !isPublicRoute(req)) {
    console.log(`DBG-MIDDLEWARE Redirecting to sign in`);
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // If the user is signed in and accessing the /my route, redirect them
  // to their actual dashboard URL if possible.
  if (userId && isMyRoute(req)) {
    if (!currentLocationId || !orgId) {
      console.log(`DBG-MIDDLEWARE Redirecting from /my to sign-in - currentLocationId: ${currentLocationId}, orgId: ${orgId}`);
      const signInUrl = new URL("/sign-in", req.url);
      return NextResponse.redirect(signInUrl);
    }

    const myDashboardRoute = `/${orgId}/${currentLocationId}/dashboard`;
    console.log(`DBG-MIDDLEWARE Redirecting from /my to ${myDashboardRoute}`);
    const myDashboardRouteUrl = new URL(myDashboardRoute, req.url);
    return NextResponse.redirect(myDashboardRouteUrl);
  }

  // If the user is logged in and the route is protected, let them view.
  if (userId && !isPublicRoute(req)) return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
