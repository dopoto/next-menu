import { BanIcon, CircleCheckIcon } from 'lucide-react';
import { GetStartedCta } from '~/components/GetStartedCta';
import { PriceTierHeader } from '~/components/PriceTierHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { priceTierFeatures } from '~/domain/price-tier-features';
import { priceTierFlags } from '~/domain/price-tier-flags';
import { priceTiers } from '~/domain/price-tiers';

export function ComparePriceTiers() {
    const priceTiersToShow = Object.values(priceTiers).filter((tier) => tier.isPublic).length;
    const priceTierColWidth = `w-1/${priceTiersToShow-1}`;
    
    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                    <TableHead />
                    {Object.values(priceTiers)
                        .filter((tier) => tier.isPublic)
                        .map((tier) => {
                            return (
                                <TableHead key={tier.id} className={`pb-8 ${priceTierColWidth}`}>
                                    <div className="flex flex-col gap-2">
                                        <PriceTierHeader tier={tier} />
                                        <GetStartedCta tier={tier.id} variant={'outline'} />
                                    </div>
                                </TableHead>
                            );
                        })}
                </TableRow>
            </TableHeader>
            <TableBody>
                {Object.values(priceTierFeatures).map((feature) => (
                    <TableRow key={feature.id}>
                        <TableCell className="font-medium  w-xs flex flex-col">
                            <div className="capitalize">{feature.resourcePluralName}</div>
                            <div className="max-w-xs font-extralight break-words whitespace-normal">
                                {feature.description}
                            </div>
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
                                        {isEnabled ? (
                                            <CircleCheckIcon className="stroke-green-600 size-5 mx-auto" />
                                        ) : (
                                            <BanIcon className="stroke-gray-300 size-5 mx-auto" />
                                        )}
                                    </TableCell>
                                );
                            })}
                    </TableRow>
                ))}
                <TableRow className="hover:bg-transparent">
                    <TableHead />
                    {Object.values(priceTiers)
                        .filter((tier) => tier.isPublic)
                        .map((tier) => (
                            <TableHead key={tier.id} className="pt-8 ">
                                <GetStartedCta tier={tier.id} variant={'outline'} />
                            </TableHead>
                        ))}
                </TableRow>
            </TableBody>
        </Table>
    );
}
