import Link from "next/link";
import { CollapsibleNavItem } from "./CollapsibleNavItem";

 
export const ManagerTopNav = () => {
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
      <CollapsibleNavItem />
    </nav>
  );
};

