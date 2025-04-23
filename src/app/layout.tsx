import { GoogleTagManager } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import { type Metadata } from 'next';
import { type ReactNode } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import { PostHogProvider } from '~/app/_components/PostHogProvider';
import { Toaster } from '~/components/ui/toaster';
import { env } from '~/env';
import '~/styles/globals.css';
import Providers from './_components/Providers';
import { buildHtmlClass } from './_utils/theme-utils';

export const metadata: Metadata = {
    title: 'The Menu',
    icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout(props: { children: ReactNode; modal: ReactNode }) {
    return (
        <html lang="en" className={buildHtmlClass()}>
            <body>
                <PostHogProvider>
                    <Providers>
                        <main className="h-full w-full">{props.children}</main>
                        {props.modal}
                        <div id="modal-root" />
                        <Toaster />
                        <GoogleTagManager gtmId={env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID ?? ''} />
                        <Analytics />
                    </Providers>
                </PostHogProvider>
            </body>
        </html>
    );
}
