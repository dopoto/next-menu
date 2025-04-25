'use client';

import { useRouter } from 'next/navigation';
import { NoQuotaLeft } from '~/app/u/[locationId]/_components/NoQuotaLeft';
import { AddMenu } from '~/app/u/[locationId]/menus/_components/AddMenu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { type LocationId } from '~/domain/locations';

export default function AddMenuDialog(props: { availableQuota: number; locationId: LocationId }) {
    const router = useRouter();

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            //TODO detect if there's no page to go back to - e.g. when route is opened directly from bookmark
            router.back();
        }
    };
    if (props.availableQuota <= 0) {
        return (
            <Dialog open={true} onOpenChange={handleOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add a menu</DialogTitle>
                        <DialogDescription> </DialogDescription>
                    </DialogHeader>
                    <NoQuotaLeft title={'Sorry, you ran out of menus...'} />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={true} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a menu</DialogTitle>
                    <DialogDescription>Fill the form below to create a menu.</DialogDescription>
                </DialogHeader>
                <AddMenu locationId={props.locationId} />
            </DialogContent>
        </Dialog>
    );
}
