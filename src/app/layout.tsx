import { GoogleTagManager } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import { type Metadata } from 'next';
import { type ReactNode } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import { PostHogProvider } from '~/components/PostHogProvider';
import Providers from '~/components/Providers';
import { Toaster } from '~/components/ui/toaster';
import { env } from '~/env';
import { buildHtmlClass } from '~/lib/theme-utils';
import '~/styles/globals.css';

export const metadata: Metadata = {
    title: 'The Menu',
    icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className={buildHtmlClass()}>
            <body>
                <PostHogProvider>
                    <Providers>
                        <main className="h-[100dvh] w-full">{children}</main>
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
