import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { priceTierFeatures } from '~/domain/price-tier-features';
import { priceTierFlags } from '~/domain/price-tier-flags';
import { priceTiers } from '~/domain/price-tiers';

const invoices = [
    {
        invoice: 'INV001',
        paymentStatus: 'Paid',
        totalAmount: '$250.00',
        paymentMethod: 'Credit Card',
    },
    {
        invoice: 'INV002',
        paymentStatus: 'Pending',
        totalAmount: '$150.00',
        paymentMethod: 'PayPal',
    },
    {
        invoice: 'INV003',
        paymentStatus: 'Unpaid',
        totalAmount: '$350.00',
        paymentMethod: 'Bank Transfer',
    },
    {
        invoice: 'INV004',
        paymentStatus: 'Paid',
        totalAmount: '$450.00',
        paymentMethod: 'Credit Card',
    },
    {
        invoice: 'INV005',
        paymentStatus: 'Paid',
        totalAmount: '$550.00',
        paymentMethod: 'PayPal',
    },
    {
        invoice: 'INV006',
        paymentStatus: 'Pending',
        totalAmount: '$200.00',
        paymentMethod: 'Bank Transfer',
    },
    {
        invoice: 'INV007',
        paymentStatus: 'Unpaid',
        totalAmount: '$300.00',
        paymentMethod: 'Credit Card',
    },
];

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
                                        {quota === 0 ? "--" : quota}
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
                                        {isEnabled ? "yes" : "no"}
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
