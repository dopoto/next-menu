import { ChevronsUpDown } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { PriceTierId, priceTiers } from '~/domain/price-tiers';
import { isPriceTierId } from '~/lib/price-tier-utils';

export function TierPill(props: { priceTierId: PriceTierId; showTierName: boolean; isExpandable: boolean }) {
    if (!isPriceTierId(props.priceTierId)) {
        return null;
    }
    const parsedToTier = priceTiers[props.priceTierId];

    return (
        <Badge className="rounded-sm text-xs uppercase shadow-md" variant={'secondary'}>
            {props.showTierName && parsedToTier.name}

            {/* TODO Handle behavior: */}
            {props.isExpandable && <ChevronsUpDown />}
        </Badge>
    );
}
