'use client';

import { useState } from 'react';
import { ComparePriceTiers } from '~/components/ComparePriceTiers';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { type PriceTierFeatureId } from '~/domain/price-tier-features';
import { type PriceTierId } from '~/domain/price-tiers';

export function ComparePlansButton(props: { currentPriceTierId: PriceTierId; featureId?: PriceTierFeatureId }) {
    const [showCompareModal, setShowCompareModal] = useState(false);
    return (
        <>
            <Button className="w-full" variant="secondary" onClick={() => setShowCompareModal(true)}>
                Compare plans
            </Button>
            <Dialog open={showCompareModal} onOpenChange={setShowCompareModal}>
                <DialogContent className="!max-w-[95vw] !w-[95vw] !h-[95vh] !max-h-[95vh] !pt-4">
                    <DialogHeader>
                        <DialogTitle>Compare plans</DialogTitle>
                    </DialogHeader>
                    <div className="h-full overflow-auto">
                        <ComparePriceTiers
                            currentPriceTierId={props.currentPriceTierId}
                            highlightedRow={props.featureId}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
