import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { type NextRequest, NextResponse } from 'next/server';
import { CookieKey } from '~/domain/cookies';
import { getValidLocationId } from '~/lib/location-utils';
import { getValidPriceTier } from '~/lib/price-tier-utils';
import { ROUTES } from '~/lib/routes';

const cookieOptions = {
    path: '/',
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
};
const redirectTo = (req: NextRequest, route: string) => NextResponse.redirect(new URL(route, req.url));
const isSignUpRoute = createRouteMatcher([ROUTES.signUp]);
const isMyRoute = createRouteMatcher([`${ROUTES.my}(.*)`]);
const isAuthProtectedRoute = createRouteMatcher([`${ROUTES.userRoot}(.*)`]);

export default clerkMiddleware(
    async (auth, req: NextRequest) => {
        const { userId, orgId, sessionClaims, redirectToSignIn } = await auth();

        if (isSignUpRoute(req)) {
            console.log(`DBG-MDLW [${req.url}] Is sign-up route`);
            const url = new URL(req.url);
            const tierParam = url.searchParams.get('tier') ?? '';
            if (getValidPriceTier(tierParam)) {
                console.log(`DBG-MDLW [${req.url}] Setting onboard-plan cookie to ${tierParam}`);
                const signUpResponse = NextResponse.next();
                signUpResponse.cookies.set(CookieKey.OnboardPlan, tierParam, cookieOptions);
                return signUpResponse;
            }
        }

        // If the user isn't signed in and the route is private, redirect to sign-in
        if (!userId && isAuthProtectedRoute(req)) {
            console.log(`DBG-MDLW [${req.url}] Not public and no user id found => Redirecting to sign in`);
            return redirectToSignIn({ returnBackUrl: req.url });
        }

        // If the user is signed in and accessing the /my route, redirect them
        // to their actual dashboard URL if possible.
        if (isMyRoute(req)) {
            if (!userId) {
                return redirectTo(req, ROUTES.signIn);
            }

            if (!orgId) {
                console.log(`DBG-MDLW [/my] Redirecting to ${ROUTES.onboardAddOrg} - no orgId`);
                return redirectTo(req, ROUTES.onboardAddOrg);
            }

            const currentLocationId = req.cookies.get(CookieKey.CurrentLocationId)?.value;
            const validCurrentLocationId = getValidLocationId(currentLocationId);
            if (validCurrentLocationId) {
                const myDashboardRoute = ROUTES.openOrders(validCurrentLocationId);
                console.log(`DBG-MDLW [/my] Redirecting from ${req.url} to ${myDashboardRoute}`);
                return redirectTo(req, myDashboardRoute);
            } else {
                // Fall back to the initial location id in the session claims
                const validInitialLocationId = getValidLocationId(sessionClaims?.metadata?.initialLocationId);
                if (validInitialLocationId) {
                    const fallbackMyDashboardRoute = ROUTES.openOrders(Number(validInitialLocationId));
                    const fallbackResponse = redirectTo(req, fallbackMyDashboardRoute);
                    fallbackResponse.cookies.set(
                        CookieKey.CurrentLocationId,
                        validInitialLocationId.toString(),
                        cookieOptions,
                    );
                    console.log(
                        `DBG-MDLW [/my] Fall back to initial location id. Redirecting from ${req.url} to ${fallbackMyDashboardRoute}`,
                    );
                    return fallbackResponse;
                } else {
                    console.log(
                        `DBG-MDLW [/my] Redirecting to ${ROUTES.resetState} - No CurrentLocationId cookie and no initialLocationId in claims metadata.`,
                    );
                    return redirectTo(req, ROUTES.resetState);
                }
            }
        }

        // For public routes, ensure we have a machineId cookie
        if (!isAuthProtectedRoute(req)) {
            const machineId = req.cookies.get(CookieKey.MachineId);
            if (!machineId) {
                const anonResponse = NextResponse.next();
                anonResponse.cookies.set(CookieKey.MachineId, crypto.randomUUID(), cookieOptions);
                return anonResponse;
            }
        }
    },
    //{ debug: env.NEXT_PUBLIC_ENV === "development" },
    { debug: false },
);

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
