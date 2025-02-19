import { type ReactNode } from "react";
import SvgIcon from "./SvgIcons";
import Link from "next/link";

export function PublicTopNav(props: { children?: ReactNode }) {
  return (
    <nav className="flex w-full p-4">
      <Link href="/">
        <SvgIcon kind="logo" size={"10"} className="fill-rose-700" />
      </Link>
      {props.children}
    </nav>
  );
}
