import { BanIcon, CircleCheckIcon } from 'lucide-react';
import { GetStartedCta } from '~/components/GetStartedCta';
import { PriceTierHeader } from '~/components/PriceTierHeader';
import { PriceTierFeatureId, priceTierFeatures } from '~/domain/price-tier-features';
import { PriceTierFlagId, priceTierFlags } from '~/domain/price-tier-flags';
import { priceTiers } from '~/domain/price-tiers';

export function ComparePriceTiers(props: {highlightedRow?: PriceTierFlagId | PriceTierFeatureId}) {
    const priceTiersToShow = Object.values(priceTiers).filter((tier) => tier.isPublic).length;

    return (
        <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden">
                    <table className="min-w-full divide-y">
                        <thead>
                            <tr
                                className="grid"
                                style={{ gridTemplateColumns: `300px repeat(${priceTiersToShow}, 1fr)` }}
                            >
                                <th className="px-6 py-3 text-left" />
                                {Object.values(priceTiers)
                                    .filter((tier) => tier.isPublic)
                                    .map((tier) => (
                                        <th key={tier.id} className="px-6 py-3 text-center">
                                            <div className="flex flex-col gap-2   h-full">
                                                <PriceTierHeader tier={tier} />
                                                <div className="flex justify-center mt-auto">
                                                    <GetStartedCta tier={tier.id} variant={'outline'} />
                                                </div>
                                            </div>
                                        </th>
                                    ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-900">
                            {Object.values(priceTierFeatures).map((feature) => (
                                <tr
                                    key={feature.id}
                                    className={`grid ${props.highlightedRow === feature.id ? 'bg-amber-100 dark:bg-amber-900/95': '' } `}
                                    style={{ gridTemplateColumns: `300px repeat(${priceTiersToShow}, 1fr)` }}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <div className="font-medium capitalize">{feature.resourcePluralName}</div>
                                            <div className="text-sm text-gray-500">{feature.description}</div>
                                        </div>
                                    </td>
                                    {Object.values(priceTiers)
                                        .filter((tier) => tier.isPublic)
                                        .map((tier) => {
                                            const featureInTier = tier.features.find((f) => f.id === feature.id);
                                            const quota = featureInTier?.quota ?? 0;
                                            return (
                                                <td key={tier.id} className="px-6 py-4">
                                                    <div className="flex justify-center items-center h-full">
                                                        {quota === 0 ? (
                                                            <BanIcon className="stroke-gray-300 size-5" />
                                                        ) : (
                                                            quota
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                </tr>
                            ))}
                            {Object.values(priceTierFlags).map((flag) => (
                                <tr
                                    key={flag.id}
                                    className={`grid ${props.highlightedRow === flag.id ? 'bg-amber-100 dark:bg-amber-900/95': '' } `}
                                    style={{ gridTemplateColumns: `300px repeat(${priceTiersToShow}, 1fr)` }}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <div className="font-medium capitalize">{flag.resourcePluralName}</div>
                                            <div className="text-sm text-gray-500">{flag.description}</div>
                                        </div>
                                    </td>
                                    {Object.values(priceTiers)
                                        .filter((tier) => tier.isPublic)
                                        .map((tier) => {
                                            const flagInTier = tier.flags.find((f) => f.id === flag.id);
                                            const isEnabled = flagInTier?.isEnabled ?? false;
                                            return (
                                                <td key={tier.id} className="px-6 py-4">
                                                    <div className="flex justify-center items-center h-full">
                                                        {isEnabled ? (
                                                            <CircleCheckIcon className="stroke-green-600 size-5" />
                                                        ) : (
                                                            <BanIcon className="stroke-gray-300 size-5" />
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                </tr>
                            ))}
                            <tr
                                className="grid"
                                style={{ gridTemplateColumns: `300px repeat(${priceTiersToShow}, 1fr)` }}
                            >
                                <td className="px-6 py-4" />
                                {Object.values(priceTiers)
                                    .filter((tier) => tier.isPublic)
                                    .map((tier) => (
                                        <td key={tier.id} className="px-6 py-4">
                                            <div className="flex justify-center">
                                                <GetStartedCta tier={tier.id} variant={'outline'} />
                                            </div>
                                        </td>
                                    ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
