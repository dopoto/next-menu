import "~/styles/globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import { type Metadata } from "next";
import { type ReactNode } from "react";
import { Toaster } from "~/components/ui/toaster";
import { buildHtmlClass } from "./_utils/theme-utils";
import Providers from "./_components/Providers";
import { GoogleTagManager } from "@next/third-parties/google";
import { env } from "~/env";
import { PostHogProvider } from "~/app/_components/PostHogProvider";

export const metadata: Metadata = {
  title: "The Menu",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout(props: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <html lang="en" className={buildHtmlClass()}>
      <PostHogProvider>
        {/* <meta name="viewport" content="width=device-width, initial-scale=1.0" /> */}
        <body>
          <Providers>
            <main className="h-full w-full">{props.children}</main>
            {props.modal}
            <div id="modal-root" />
            <Toaster />
            <GoogleTagManager
              gtmId={env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID ?? ""}
            />
          </Providers>
        </body>
      </PostHogProvider>
    </html>
  );
}
