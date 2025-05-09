'use client';

import { useRouter } from 'next/navigation';
import { type ReactNode } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog';

export function LocationDialog(props: { locationName: string; children: ReactNode }) {
    const router = useRouter();

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            //TODO detect if there's no page to go back to - e.g. when route is opened directly from bookmark
            router.back();
        }
    };

    return (
        <Dialog open={true} onOpenChange={handleOpenChange}>
            <DialogContent className="!max-w-[95vw] !w-[95vw] !h-[95vh] !max-h-[95vh] !pt-4 flex flex-col">
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex w-full gap-2">
                            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                                {props.locationName.slice(0, 3).toLocaleUpperCase()}
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="text-tiny truncate antialiased">LOCATION</span>
                                <span className="truncate font-semibold">{props.locationName}</span>
                            </div>
                        </div>
                    </DialogTitle>
                    <DialogDescription> </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-auto">{props.children}</div>
            </DialogContent>
        </Dialog>
    );
}
