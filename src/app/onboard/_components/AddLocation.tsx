'use client';

import { useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';
import { onboardCreateOrganizationAction } from '~/app/actions/onboardCreateOrganizationAction';
import { AddEditLocationForm } from '~/components/AddEditLocationForm';
import { OverviewCard } from '~/components/OverviewCard';
import { locationFormSchema } from '~/domain/locations';
import { type PriceTierId } from '~/domain/price-tiers';
import { ROUTES } from '~/lib/routes';
import { cn } from '~/lib/utils';

export const AddLocation = ({
    priceTierId,
    stripeSessionId,
    className,
}: {
    priceTierId: PriceTierId;
    stripeSessionId?: string;
    className?: string;
}) => {
    const { user } = useUser();
    const router = useRouter();

    const handleSubmit = async (values: z.infer<typeof locationFormSchema>) => {
        const res = await onboardCreateOrganizationAction(priceTierId, stripeSessionId ?? '', values);
        if (res?.message) {
            // Reloads the user's data from the Clerk API
            await user?.reload();
            router.push(ROUTES.onboardOverview);
        }
    };

    const addLocationForm = useForm<z.infer<typeof locationFormSchema>>({
        resolver: zodResolver(locationFormSchema),
        defaultValues: {
            currencyId: 'USD',
            locationName: '',
            menuMode: 'interactive',
        },
    });
    const addLocationFormComponent = (
        <div className="pt-8">
            <AddEditLocationForm form={addLocationForm} onSubmit={handleSubmit} />
        </div>
    );

    return (
        <div className={cn('flex w-full flex-col gap-6', className)}>
            <div>{`Now, let's create your default location - the restaurant, bar or pub you will manage digital menus for.`}</div>
            <div>{`All these settings can be changed anytime later from your account.`}</div>
            <OverviewCard
                variant={'form'}
                title={'Add location'}
                sections={[
                    {
                        title: '',
                        content: addLocationFormComponent,
                    },
                ]}
            />
        </div>
    );
};
