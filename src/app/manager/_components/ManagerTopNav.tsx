"use client";

import Link from "next/link";
import { CollapsibleNavItem } from "./CollapsibleNavItem";
import { usePathname, useRouter } from "next/navigation";
import { buildBreadcrumbs, routes } from "../_domain/routes";
import { findRoute } from "../_domain/routes";

export const ManagerTopNav = () => {
  const pathname = usePathname();
  const currentRoute = findRoute(pathname);

  const breadcrumbs = buildBreadcrumbs(pathname)

  return (
    <nav className="flex flex-row items-center gap-2">
      <Link href="/">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="./logo.svg"
          alt="Logo"
          className="h-10 w-10 stroke-amber-400"
        />
      </Link>
      <span>/</span>
      <CollapsibleNavItem />[{currentRoute?.name}]
    </nav>
  );
};
