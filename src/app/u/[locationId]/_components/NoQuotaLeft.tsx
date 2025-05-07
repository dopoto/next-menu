'use client';

import { CrownIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent } from '~/components/ui/dialog';
import { ComparePriceTiers } from '~/components/ComparePriceTiers';
import { ROUTES } from '~/lib/routes';
import { PriceTierFeatureId, priceTierFeatures } from '~/domain/price-tier-features';
import { PriceTierId } from '~/domain/price-tiers';

export function NoQuotaLeft(props: { currentPriceTierId: PriceTierId, featureId: PriceTierFeatureId }) {
    const [showCompareModal, setShowCompareModal] = useState(false);

    const feature = priceTierFeatures[props.featureId];

    const title = `You have used all ${feature?.resourcePluralName} available in your current plan`

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
                <Button className="w-full" variant="secondary" onClick={() => setShowCompareModal(true)}>
                    Compare plans
                </Button>
            </div>

            <Dialog open={showCompareModal} onOpenChange={setShowCompareModal}>
                <DialogContent className="!max-w-[95vw] !w-[95vw] !h-[95vh] !max-h-[95vh] !p-0">
                    <div className="h-full overflow-auto p-6">
                        <ComparePriceTiers currentPriceTierId={props.currentPriceTierId} highlightedRow={props.featureId} />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
