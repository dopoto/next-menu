'use client';

import { useState } from 'react';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '~/components/ui/drawer';
import { cn } from '~/lib/utils';

interface FooterDrawerProps {
    collapsedContent?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
    triggerClassName?: string;
    contentClassName?: string;
}

export function PublicFooterDrawer({
    collapsedContent,
    children,
    className,
    triggerClassName,
    contentClassName,
}: FooterDrawerProps) {
    const [open, setOpen] = useState(false);

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <div
                    className={cn(
                        'fixed bottom-0 left-0 right-0 flex h-45 cursor-pointer items-center justify-center bg-background shadow-[0_-2px_10px_rgba(0,0,0,0.1)] transition-all hover:bg-muted',
                        open ? 'opacity-0' : 'opacity-100',
                        triggerClassName,
                    )}
                >
                    {collapsedContent}
                </div>
            </DrawerTrigger>
            <DrawerContent className={cn('max-h-[80vh]', contentClassName)}>
                <DrawerHeader className="sr-only">
                    <DrawerTitle>Your order</DrawerTitle>
                </DrawerHeader>
                <div className={cn('mx-auto w-full max-w-md', className)}>
                    <div className="px-4 pb-4">{children}</div>
                    <DrawerFooter>
                        <DrawerClose>Close</DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
