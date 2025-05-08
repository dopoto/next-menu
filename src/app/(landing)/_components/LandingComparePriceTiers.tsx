import { LandingSectionTitle } from '~/app/(landing)/_components/LandingSectionTitle';
import { ComparePriceTiers } from '~/components/ComparePriceTiers';
import { sections } from '~/domain/landing-content';

export function LandingComparePriceTiers() {
    const { label, title, secondary } = sections.compare!.header;
    return (
        <div className="bg-background pt-16" id="compare">
            <div className="mx-auto max-w-7xl   sm:px-6 lg:px-8">
                <LandingSectionTitle label={label} title={title} secondary={secondary} />
                <div className="py-16">
                    <ComparePriceTiers />
                </div>
            </div>
        </div>
    );
}
//
