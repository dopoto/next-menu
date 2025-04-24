import Link from 'next/link';
import { PriceTierCard } from '~/app/_components/PriceTierCard';
import { Button } from '~/components/ui/button';
import { priceTiers } from '~/domain/price-tiers';
import { ROUTES } from '~/lib/routes';

export async function SignUpPlanSelector() {
    return (
        <div className="flex flex-col gap-3">
            <p className="pb-4 text-sm">You can upgrade, downgrade or cancel your plan instantly anytime later.</p>
            {Object.entries(priceTiers).map(([, tier]) => {
                if (!tier.isPublic) {
                    return null;
                }

                const footerCta = (
                    <Link href={ROUTES.signUpForPriceTier(tier.id)} className="w-full">
                        <Button className="w-full" variant="default">
                            Select this plan
                        </Button>
                    </Link>
                );

                return <PriceTierCard key={tier.name} tier={tier} footerCta={footerCta} />;
            })}
        </div>
    );
}
