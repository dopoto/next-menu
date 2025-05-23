import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { OverviewCard } from '~/components/OverviewCard';
import { getCurrentPlanCardCustomizations, PriceTierCard } from '~/components/PriceTierCard';
import { SplitScreenContainer } from '~/components/SplitScreenContainer';
import SvgIcon from '~/components/SvgIcons';
import { Button } from '~/components/ui/button';
import { APP_CONFIG } from '~/config/app-config';
import { AppError } from '~/lib/error-utils.server';
import { getPriceTierChangeScenario, getValidPriceTier } from '~/lib/price-tier-utils';
import { getExceededFeatures } from '~/lib/price-tier-utils.server-only';
import { ROUTES } from '~/lib/routes';
import { obj2str } from '~/lib/string-utils';

export const metadata = {
    title: `${APP_CONFIG.appName} - Change Plan > Review`,
};

export type Params = Promise<{ tier: string }>;

export default async function ChangePlanPage(props: { params: Params }) {
    const { userId, orgId, sessionClaims } = await auth();
    if (!userId || !orgId) {
        redirect(ROUTES.signIn);
    }

    const params = await props.params;

    // Expecting a valid To tier:
    const parsedToTier = getValidPriceTier(params.tier);
    if (!parsedToTier) {
        throw new AppError({
            internalMessage: `Missing or invalid To tier in params: ${obj2str(params)}`,
        });
    }

    // Expecting a valid From tier:
    const parsedFromTier = getValidPriceTier(sessionClaims?.metadata?.tier);
    if (!parsedFromTier) {
        throw new AppError({
            internalMessage: `Missing or invalid From tier in sessionClaims: ${obj2str(sessionClaims)}`,
        });
    }

    // If user tries to downgrade to a tier that cannot accomodate their current usage, redirect back:
    const exceededFeatures = await getExceededFeatures(parsedFromTier.id, parsedToTier.id);
    if (exceededFeatures?.length > 0) {
        return redirect(ROUTES.changePlan);
    }

    // If user tries to change to their current tier, redirect back
    if (parsedToTier.id === parsedFromTier.id) {
        return redirect(ROUTES.changePlan);
    }

    const priceTierChangeScenario = getPriceTierChangeScenario(parsedFromTier.id, parsedToTier.id);

    const theWhat = `You're about to move from our ${parsedFromTier.name} plan to our ${parsedToTier.name} plan.`;
    let theHow = '';
    let theWhen = '';
    let buttonText = '';
    let changeUrl = '';

    switch (priceTierChangeScenario) {
        case 'free-to-paid':
            theHow = `You will need to complete a Stripe payment in the next step.`;
            theWhen = `Your account will move to the ${parsedToTier.name} plan right away.`;
            buttonText = `Subscribe to ${parsedToTier.name}`;
            changeUrl = ROUTES.changePlanToPlan('free-to-paid', parsedToTier.id);
            break;
        case 'free-to-free':
            theHow = `Click the button below to confirm the plan change.`;
            theWhen = `Your account will move to the ${parsedToTier.name} plan right away.`;
            buttonText = `Change to ${parsedToTier.name}`;
            changeUrl = ROUTES.changePlanToPlan('free-to-free', parsedToTier.id);
            break;
        case 'paid-to-free':
            theHow = `Your account will be credited in the next step with an amount corresponding to the 
      remaining days in your currently active subscription.`;
            theWhen = `Your account will move to the ${parsedToTier.name} plan right away.`;
            buttonText = `Downgrade to ${parsedToTier.name}`;
            changeUrl = ROUTES.changePlanToPlan('paid-to-paid', parsedToTier.id);
            break;
        case 'paid-to-paid-upgrade':
            theHow = `You will now need to complete a payment covering the remaining days in your current month.`;
            theWhen = `Your account will move to the ${parsedToTier.name} plan right away.`;
            buttonText = `Upgrade to ${parsedToTier.name}`;
            changeUrl = ROUTES.changePlanToPlan('upgrade', parsedToTier.id);
            break;
        case 'paid-to-paid-downgrade':
            theHow = `You will receive a credit for the remaining time on your current ${parsedFromTier.name} subscription and you 
        will be billed now for the new, lower-cost subscription.`;
            theWhen = `Your account will move to the ${parsedToTier.name} plan right away.`;
            buttonText = `Downgrade to ${parsedToTier.name}`;
            changeUrl = ROUTES.changePlanToPlan('downgrade', parsedToTier.id);
            break;
        default:
            return null;
    }

    const overviewSections = [
        { title: 'what', content: theWhat },
        { title: 'how', content: theHow },
        { title: 'when', content: theWhen },
    ];

    const fromTierCardCustomizations = getCurrentPlanCardCustomizations();
    fromTierCardCustomizations.containerStyle += ' w-full';

    return (
        <SplitScreenContainer
            mainComponent={
                <div className="flex flex-col items-center gap-4">
                    <OverviewCard title={'Overview'} sections={overviewSections} variant="preview" className="w-full" />
                    <PriceTierCard tier={parsedFromTier} cardCustomizations={fromTierCardCustomizations} />
                    <SvgIcon
                        kind={'arrowDoodle'}
                        className={'fill-gray-500 stroke-gray-500 dark:fill-gray-400 dark:stroke-gray-400'}
                    />
                    <PriceTierCard tier={parsedToTier} cardCustomizations={{ containerStyle: 'w-full' }} />
                    <div className="flex w-full flex-col gap-2 pt-4">
                        <Link href={changeUrl} className="w-full">
                            <Button variant={'default'} className="w-full">
                                {buttonText}
                            </Button>
                        </Link>
                        <Link href={ROUTES.changePlan} className="w-full">
                            <Button variant="outline" className="w-full">
                                Go back
                            </Button>
                        </Link>
                    </div>
                </div>
            }
            title="Change Plan"
            subtitle="Review your changes below"
        />
    );
}
