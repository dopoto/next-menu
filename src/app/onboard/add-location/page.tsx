import { auth } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';
import { SplitScreenContainer } from '~/app/_components/SplitScreenContainer';
import { APP_CONFIG } from '~/app/_config/app-config';
import { CookieKey } from '~/app/_domain/cookies';
import type { PriceTierId } from '~/app/_domain/price-tiers';
import { getValidPriceTier, isFreePriceTier } from '~/app/_utils/price-tier-utils';
import { env } from '~/env';
import { AppError } from '~/lib/error-utils.server';
import { ROUTES } from '~/lib/routes';
import { AddLocation } from '../_components/AddLocation';
import { LocationCreated } from '../_components/LocationCreated';
import { OnboardingStepper } from '../_components/OnboardingStepper';

export const metadata = {
    title: `${APP_CONFIG.appName} - Onboard > Add location`,
};

export const dynamic = 'force-dynamic';

const stripeApiKey = env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeApiKey);

export type SearchParams = Promise<Record<'session_id', string | string[] | undefined>>;

export default async function OnboardAddLocationPage(props: { searchParams: SearchParams }) {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
        redirect(ROUTES.signIn);
    }

    const cookieStore = cookies();
    const tier = (await cookieStore).get(CookieKey.OnboardPlan)?.value;
    const parsedTier = getValidPriceTier(tier);

    if (!parsedTier) {
        redirect(ROUTES.onboardSelectPlan);
    }
    const parsedTierId = parsedTier.id;

    const searchParams = await props.searchParams;
    const stripeSessionId = searchParams.session_id?.toString() ?? '';

    let mainComponent;
    if (sessionClaims.metadata.currentLocationId) {
        mainComponent = <LocationCreated />;
    } else if (isFreePriceTier(parsedTierId)) {
        mainComponent = <AddLocation priceTierId="start" />;
    } else {
        mainComponent = await getMainComponent(stripeSessionId, parsedTierId);
    }

    return (
        <SplitScreenContainer
            mainComponent={mainComponent}
            secondaryComponent={<OnboardingStepper currentStep={'addLocation'} tierId={parsedTierId} />}
            title={"Let's get you onboarded!"}
            subtitle={'This should just take a minute...'}
        ></SplitScreenContainer>
    );
}

export const getMainComponent = async (stripeSessionId: string, tierId: PriceTierId) => {
    let mainComponent;
    if (stripeSessionId?.length === 0) {
        throw new AppError({ internalMessage: 'Stripe - missing stripeSessionId' });
    } else {
        let sessionStatus: string | null = '';

        // If we are on a non-free onboarding, we need to ensure that the payment
        // has been completed successfully before showing an Add Location form here.

        const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
        sessionStatus = session.status;
        switch (sessionStatus) {
            case 'complete':
                mainComponent = <AddLocation priceTierId={tierId} stripeSessionId={stripeSessionId} />;
                break;
            case 'expired':
                throw new AppError({
                    internalMessage: `Stripe - payment expired for session id ${session.id}`,
                });
            case 'open':
                throw new AppError({
                    internalMessage: `Stripe - payment is open for session id ${session.id}`,
                });
            default:
                throw new AppError({
                    internalMessage: `Stripe - unknown status ${sessionStatus} for session id ${session.id}`,
                });
        }
    }

    return mainComponent;
};
