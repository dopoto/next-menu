'use client';

import { CopyIcon } from 'lucide-react';
import { toast } from '~/hooks/use-toast';

export function CopyButton(props: { textToCopy: string }) {
    return (
        <CopyIcon
            className="cursor-pointer stroke-gray-700"
            onClick={async () => {
                await navigator.clipboard.writeText(props.textToCopy);
                toast({
                    title: 'Copied to clipboard!',
                });
            }}
        />
    );
}
