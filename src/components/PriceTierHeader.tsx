import { PageSubtitle } from '~/components/PageSubtitle';
import { type PriceTier } from '~/domain/price-tiers';

export function PriceTierHeader(props: { tier: PriceTier }) {
    const { name, description, monthlyUsdPrice } = props.tier;

    return (
        <div className="flex flex-col items-start">
            <div className="text-xl font-light">{name}</div>
            <div className="font-medium">{getPrice(monthlyUsdPrice)}</div>
            <div className="w-full text-left">
                <PageSubtitle textSize="base">{description}</PageSubtitle>
            </div>
        </div>
    );
}

const getPrice = (monthlyUsdPrice: number) => {
    if (monthlyUsdPrice === -1) return `__.__`;
    if (monthlyUsdPrice === 0)
        return (
            <div>
                <span className="text-xl font-bold">FREE</span>
            </div>
        );
    return (
        <div>
            <span className="text-xl font-bold">${monthlyUsdPrice.toFixed(2)}</span>
            <span className="text-muted-foreground ml-1 text-xl font-light">/month</span>
        </div>
    );
};
