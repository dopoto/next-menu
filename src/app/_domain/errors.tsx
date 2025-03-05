import Link from "next/link";
import { type ReactNode } from "react";
import { Button } from "~/components/ui/button";

export type ErrorTypeId = "MENUS_INVALID_PARAM" | "ORDERS_INVALID_PARAM";
export type Error = {
  errorTypeId: ErrorTypeId;
  userFriendlyTitle: string;
  userFriendlyDescription: string;
  ctas?: ReactNode[];
};

export const errorTypes: Record<ErrorTypeId, Error> = {
  ORDERS_INVALID_PARAM: {
    errorTypeId: "ORDERS_INVALID_PARAM",
    userFriendlyTitle: "Could not load orders data",
    userFriendlyDescription:
      "Please go to your home page, then try returning to this page from the sidebar menu.",
    ctas: [
      <Link key="home" href="/my">
        <Button>My home page</Button>
      </Link>,
    ],
  },
  MENUS_INVALID_PARAM: {
    errorTypeId: "MENUS_INVALID_PARAM",
    userFriendlyTitle: "Could not load menus data",
    userFriendlyDescription:
      "Please go to your home page, then try returning to this page from the sidebar menu.",
    ctas: [
      <Link key="home" href="/my">
        <Button>My home page</Button>
      </Link>,
    ],
  },
};
