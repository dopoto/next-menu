import { CreateOrganization } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { OnboardingStepper } from '~/app/onboard/_components/OnboardingStepper';
import { OrgCreated } from '~/app/onboard/_components/OrgCreated';
import { SplitScreenContainer } from '~/components/SplitScreenContainer';
import { APP_CONFIG } from '~/config/app-config';
import { CookieKey } from '~/domain/cookies';
import { getValidPriceTier, isPaidPriceTier } from '~/lib/price-tier-utils';
import { ROUTES, type AppRouteKey } from '~/lib/routes';

export const metadata = {
    title: `${APP_CONFIG.appName} - Onboard > Add organization`,
};

export const dynamic = 'force-dynamic';

export default async function OnboardAddOrgPage() {
    const { userId, orgId } = await auth();
    if (!userId) {
        redirect(ROUTES.signIn);
    }

    const cookieStore = cookies();
    const tier = (await cookieStore).get(CookieKey.OnboardPlan)?.value;
    const parsedTier = getValidPriceTier(tier);

    if (!parsedTier) {
        redirect(ROUTES.onboardSelectPlan);
    }
    const nextStep: AppRouteKey = isPaidPriceTier(parsedTier.id) ? ROUTES.onboardPayment : ROUTES.onboardAddLocation;

    const mainComponent = orgId ? (
        <OrgCreated nextStepRoute={nextStep} />
    ) : (
        <CreateOrganization afterCreateOrganizationUrl={nextStep} skipInvitationScreen={true} hideSlug={true} />
    );

    return (
        <SplitScreenContainer
            mainComponent={mainComponent}
            secondaryComponent={<OnboardingStepper currentStep={'addOrg'} tierId={parsedTier.id} />}
            title={"Let's get you onboarded!"}
            subtitle={'This should just take a minute...'}
        ></SplitScreenContainer>
    );
}
