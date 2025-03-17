import React from 'react';
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  if ((await auth()).sessionClaims?.metadata.orgName) {
    redirect("/onboarded");
  }

  return (
    <>{children}</>
  );
}
