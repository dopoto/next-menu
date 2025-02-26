import { type ReactNode } from "react";
import SvgIcon from "./SvgIcons";
import Link from "next/link";

// TODO flag prop to confirm navigate out on logo click

export function PublicTopNav(props: { children?: ReactNode }) {
  return (
    <nav className="flex w-full ">
      <Link href="/">
        <SvgIcon kind="logo" size={"10"} className="fill-rose-700" />
      </Link>
      {props.children}
    </nav>
  );
}
