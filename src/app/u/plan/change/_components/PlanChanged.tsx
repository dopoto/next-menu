import Link from 'next/link';
import { getCurrentPlanCardCustomizations, PriceTierCard } from '~/app/_components/PriceTierCard';
import SvgIcon from '~/app/_components/SvgIcons';
import { type PriceTier } from '~/app/_domain/price-tiers';
import { Button } from '~/components/ui/button';
import { ROUTES } from '~/lib/routes';

export function PlanChanged(props: { fromTier: PriceTier; toTier: PriceTier }) {
    const toTierCardCustomizations = getCurrentPlanCardCustomizations();
    toTierCardCustomizations.containerStyle += ' w-full';

    return (
        <div className="flex flex-col flex-nowrap items-center gap-4">
            <PriceTierCard tier={props.fromTier} cardCustomizations={{ containerStyle: 'w-full' }} />
            <SvgIcon
                kind={'arrowDoodle'}
                className={'fill-gray-500 stroke-gray-500 dark:fill-gray-400 dark:stroke-gray-400'}
            />
            <PriceTierCard tier={props.toTier} cardCustomizations={toTierCardCustomizations} />
            <div className="flex w-full flex-col gap-2 pt-4">
                <Link href={ROUTES.my} className="w-full">
                    <Button variant="outline" className="w-full">
                        Go back to my account
                    </Button>
                </Link>
            </div>
        </div>
    );
}
