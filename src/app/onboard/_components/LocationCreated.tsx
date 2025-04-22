import Link from 'next/link';
import { Labeled } from '~/app/_components/Labeled';
import { OverviewCard } from '~/app/_components/OverviewCard';
import { Button } from '~/components/ui/button';
import { ROUTES } from '~/lib/routes';

export async function LocationCreated(props: { locationName: string }) {
    return (
        <>
            <OverviewCard
                title={'Location created'}
                sections={[
                    {
                        title: '',
                        content: (
                            <div className="mt-2 flex flex-col flex-nowrap gap-2">
                                <Labeled label={'Name'} text={props.locationName} />
                            </div>
                        ),
                    },
                ]}
                variant="confirmation"
            />
            <div className="flex w-full flex-col gap-2">
                <Link href={ROUTES.onboardOverview} className="w-full">
                    <Button variant="outline" className="w-full">
                        Go to next step
                    </Button>
                </Link>
            </div>
        </>
    );
}
