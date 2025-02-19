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
        {/* <body className="flex min-h-screen items-center justify-center bg-gray-50 p-4 overflow-auto" >
          {props.children}
          {props.modal}
          <div id="modal-root" />
          <Toaster />
        </body> */}
        <body className="flex min-h-screen items-center justify-center bg-gray-500 p-0 overflow-y-auto">
          {props.children}
          {props.modal}
          <div id="modal-root" />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
