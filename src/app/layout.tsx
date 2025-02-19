import { ClerkProvider } from "@clerk/nextjs";
import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { type ReactNode } from "react";
import { Toaster } from "~/components/ui/toaster";

export const metadata: Metadata = {
  title: "The Menu",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout(props: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <body className="bg-gray-100 min-h-screen">
          <nav id="topbar" className="  h-8 z-10 w-full p-4 ">
            top bar 
          </nav>
          <main className="flex justify-center p-4 min-h-[calc(100vh - 64px)] mt-8">
            {props.children}
          </main>
          {props.modal}
          <div id="modal-root" />
          <Toaster />
          <footer className="h-3">some footer</footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
