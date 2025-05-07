import { BanIcon, CircleCheckIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { priceTierFeatures } from '~/domain/price-tier-features';
import { priceTierFlags } from '~/domain/price-tier-flags';
import { priceTiers } from '~/domain/price-tiers';

export function ComparePriceTiers() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[250px]"> </TableHead>
                    {Object.values(priceTiers)
                        .filter((tier) => tier.isPublic)
                        .map((tier) => (
                            <TableHead key={tier.id} className="text-xl text-center">
                                {tier.name}
                            </TableHead>
                        ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {Object.values(priceTierFeatures).map((feature) => (
                    <TableRow key={feature.id}>
                        <TableCell className="font-medium capitalize flex flex-col">
                          <div>{feature.resourcePluralName}</div>
                          <div className="font-extralight">{feature.description}</div>
                          </TableCell>
                        {Object.values(priceTiers)
                            .filter((tier) => tier.isPublic)
                            .map((tier) => {
                                const featureInTier = tier.features.find((f) => f.id === feature.id);
                                const quota = featureInTier?.quota ?? 0;
                                return (
                                    <TableCell key={tier.id} className="text-center">
                                        {quota === 0 ? <BanIcon className="stroke-gray-300 size-5 mx-auto" /> : quota}
                                    </TableCell>
                                );
                            })}
                    </TableRow>
                ))}
                {Object.values(priceTierFlags).map((flag) => (
                    <TableRow key={flag.id}>
                        <TableCell className="font-medium capitalize flex flex-col">
                          <div>{flag.resourcePluralName}</div>
                          <div className="font-extralight">{flag.description}</div>
                          </TableCell>
                        {Object.values(priceTiers)
                            .filter((tier) => tier.isPublic)
                            .map((tier) => {
                                const flagInTier = tier.flags.find((f) => f.id === flag.id);
                                const isEnabled = flagInTier?.isEnabled ?? false;
                                return (
                                    <TableCell key={tier.id} className="text-center">
                                        {isEnabled ? <CircleCheckIcon className="stroke-green-600 size-5 mx-auto" /> : <BanIcon className="stroke-gray-300 size-5 mx-auto" />}
                                    </TableCell>
                                );
                            })}
                    </TableRow>
                ))}
            </TableBody>
            {/*<TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
        </Table>
    );
}
