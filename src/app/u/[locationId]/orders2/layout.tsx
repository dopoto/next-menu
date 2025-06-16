import { DataLoader } from '~/app/u/[locationId]/orders2/_components/DataLoader';
import { Suspense } from 'react';
import { LoadingSection } from '~/app/u/[locationId]/_components/LoadingSection';

type Params = Promise<{ locationId: string }>;

export default async function Orders2Layout(props: {
    children: React.ReactNode;
    params: Params;
}) {
    const params = await props.params;

    return (
        <Suspense fallback={<LoadingSection />}>
            <DataLoader locationId={params.locationId} children={props.children} />
        </Suspense>
    );

}
