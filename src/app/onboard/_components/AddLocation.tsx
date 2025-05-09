'use client';

import { useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { onboardCreateOrganizationAction } from '~/app/actions/onboardCreateOrganizationAction';
import { AddEditLocationForm } from '~/components/AddEditLocationForm';
import { OverviewCard } from '~/components/OverviewCard';
import { SelectControl, type SelectControlOptions } from '~/components/SelectControl';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { CURRENCIES } from '~/domain/currencies';
import { locationFormSchema } from '~/domain/locations';
import { type PriceTierId } from '~/domain/price-tiers';
import { ROUTES } from '~/lib/routes';
import { cn } from '~/lib/utils';

export const AddLocation = ({
    priceTierId,
    stripeSessionId,
    slug,
    className,
}: {
    priceTierId: PriceTierId;
    stripeSessionId?: string;
    slug: string;
    className?: string;
}) => {
    const [errors, setErrors] = useState<string[]>();
    const { user } = useUser();
    const router = useRouter();

    const options: SelectControlOptions = Object.entries(CURRENCIES).map(([code, currency]) => ({
        value: code,
        label: (
            <>
                <Badge variant={'secondary'} style={{ width: '70px' }}>
                    {currency.code} {currency.symbol_native}
                </Badge>{' '}
                {currency.name}{' '}
            </>
        ),
        searchLabel: `${currency.name} ${currency.symbol}  ${currency.symbol_native}   ${currency.code}`,
    }));

    const handleSubmit = async (values: z.infer<typeof locationFormSchema>) => {
        const res = await onboardCreateOrganizationAction(priceTierId, stripeSessionId ?? '', slug, values);
        if (res?.message) {
            // Reloads the user's data from the Clerk API
            await user?.reload();
            router.push(ROUTES.onboardOverview);
        }
        if (res?.errors) {
            setErrors(res?.errors);
            console.log(res?.eventId); //TODO
        }
    };

    const addLocationForm  = useForm<z.infer<typeof locationFormSchema>>({
        resolver: zodResolver(locationFormSchema),
        defaultValues: {
            currencyId: 'USD',
            locationName: ''
        },
    });
    const addLocationFormComponent = <AddEditLocationForm form={addLocationForm} onSubmit={handleSubmit} />

    return (
        <div className={cn('flex w-full flex-col gap-6', className)}>
            <OverviewCard
                title={'Add a location'}
                subtitle={`This can be changed anytime later from your account.`}
                sections={[
                    {
                        title: '',
                        content: addLocationFormComponent
                        // content: (
                        //     <form action={handleSubmit}>
                        //         <input type="hidden" name="priceTierId" value={priceTierId} />
                        //         <input type="hidden" name="stripeSessionId" value={stripeSessionId} />
                        //         <input type="hidden" name="slug" value={slug} />
                        //         <div className="mt-6 flex w-full flex-col gap-6">
                        //             <div className="grid gap-2">
                        //                 <Label htmlFor="locationName">The name of your restaurant, pub or bar</Label>
                        //                 <Input
                        //                     id="locationName"
                        //                     name="locationName"
                        //                     placeholder="My Fancy Restaurant"
                        //                     required
                        //                 />
                        //             </div>
                        //             <div className="grid gap-2">
                        //                 <Label htmlFor="currencyId">
                        //                     The currency to be used in the menus of this location.
                        //                 </Label>
                        //                 <SelectControl id="currencyId" options={options} />
                        //             </div>
                        //             {errors && errors.length > 0 && (
                        //                 <div className="text-red-600">
                        //                     {errors.map((err) => (
                        //                         <p key={err}>{err}</p>
                        //                     ))}
                        //                 </div>
                        //             )}

                        //             <Button type="submit" className="w-full">
                        //                 Submit
                        //             </Button>
                        //         </div>
                        //     </form>
                        // ),
                    },
                ]}
                variant={'neutral'}
            />
        </div>
    );
};
