import { auth } from '@clerk/nextjs/server';
import { CrownIcon } from 'lucide-react';
import Link from 'next/link';
import { ComparePlansButton } from '~/app/u/[locationId]/_components/ComparePlansButton';
import { Button } from '~/components/ui/button';
import { PriceTierFeatureId, priceTierFeatures } from '~/domain/price-tier-features';
import { AppError } from '~/lib/error-utils.server';
import { getValidPriceTier } from '~/lib/price-tier-utils';
import { ROUTES } from '~/lib/routes';

export async function NoQuotaLeft(props: {  featureId: PriceTierFeatureId }) {
    const feature = priceTierFeatures[props.featureId];
    const title = `You have used all ${feature?.resourcePluralName} available in your current plan`;

    const { sessionClaims } = await auth();
    const tierId = sessionClaims?.metadata.tier;
    const parsedTier = getValidPriceTier(tierId);
    if (!parsedTier) {
        throw new AppError({
            internalMessage: `No valid tier found in auth.`,
        });
    }

    return (
        <div className="animate-in fade-in-50 flex h-full flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <div className="mx-auto flex flex-col items-center justify-center gap-2 text-center">
                <CrownIcon size="36" className="text-amber-700" />
                <h3 className="text-lg font-semibold text-amber-700">{title}</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                    Not to worry, you can get more by upgrading your plan.
                </p>
                <Button className="w-full" variant="default" asChild>
                    <Link href={ROUTES.changePlan}>Change plan</Link>
                </Button>
                <Button className="w-full" variant="secondary" asChild>
                    <Link href={ROUTES.viewPlan}>View plan usage</Link>
                </Button>
                <ComparePlansButton currentPriceTierId={parsedTier.id} featureId={props.featureId} />
            </div>
        </div>
    );
}
