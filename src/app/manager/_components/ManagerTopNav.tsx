"use client";

import Link from "next/link";
import { CollapsibleNavItem } from "./CollapsibleNavItem";
import { usePathname } from "next/navigation";
import { buildBreadcrumbs } from "../_domain/routes";
import { Fragment } from "react";

export const ManagerTopNav = () => {
  const pathname = usePathname();
  const breadcrumbs = buildBreadcrumbs(pathname);

  return (
    <nav className="flex flex-row items-center gap-2">
      <Link href="/">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.svg"
          alt="Logo"
          className="h-10 w-10"
        />
      </Link>
      <span>/</span>

      {breadcrumbs.map((b, index) => (
        <Fragment key={b.level}>
          <CollapsibleNavItem
            activeRoute={{
              ...b.activeRoute,
              displayMode: index === breadcrumbs.length - 1 ? "text" : "link",
            }}
            siblings={b.siblingRoutes}
          ></CollapsibleNavItem>
          {index !== breadcrumbs.length - 1 && <>/</>}
        </Fragment>
      ))}
    </nav>
  );
};
