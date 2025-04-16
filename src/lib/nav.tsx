import {
  ChartPie,
  LayoutDashboardIcon,
  ScanQrCodeIcon,
  UtensilsCrossedIcon,
} from "lucide-react";
import { type ReactNode } from "react";
import { type AppRouteKey, ROUTES } from "~/lib/routes";

type RouteId =
  | "ROOT"
  | "dashboard"
  | "locationManager"
  | "live"
  | "reports"
  | "menus"
  | "menusAdd"
  | "menuItems"
  | "menuItemsAdd"
  | "menuItemsEdit";

export type NavItem = {
  id: RouteId;
  icon?: ReactNode;
  title?: string;
  route?: AppRouteKey;
  children?: NavItem[];
};

export const NAV_ITEMS: Record<RouteId, NavItem> = {
  ROOT: {
    id: "ROOT",
  },
  dashboard: {
    id: "dashboard",
  },
  locationManager: {
    id: "locationManager",
  },
  live: {
    id: "live",
    icon: <LayoutDashboardIcon size={16} />,
    title: "Open orders",
    route: ROUTES.live,
  },
  reports: {
    id: "reports",
    icon: <ChartPie size={16} />,
    title: "Reports",
    route: ROUTES.reports,
  },
  menus: {
    id: "menus",
    icon: <ScanQrCodeIcon size={16} />,
    title: "Menus",
    route: ROUTES.menus,
  },
  menusAdd: {
    id: "menusAdd",
    title: "Add menu",
    route: ROUTES.menusAdd,
  },
  menuItems: {
    id: "menuItems",
    icon: <UtensilsCrossedIcon size={16} />,
    title: "Dishes & Drinks",
    route: ROUTES.menuItems,
  },
  menuItemsAdd: {
    id: "menuItemsAdd",
    title: "Add",
    route: ROUTES.menuItemsAdd,
  },
  menuItemsEdit: {
    id: "menuItemsEdit",
    title: "Edit menu item",
    route: ROUTES.menuItemsEdit,
  },
};

export const MENU_TREE: NavItem = {
  ...NAV_ITEMS["ROOT"],
  children: [
    {
      ...NAV_ITEMS["dashboard"],
      children: [NAV_ITEMS["live"], NAV_ITEMS["reports"]],
    },
    {
      ...NAV_ITEMS["locationManager"],
      children: [
        {
          ...NAV_ITEMS["menus"],
          children: [NAV_ITEMS["menusAdd"]],
        },
        {
          ...NAV_ITEMS["menuItems"],
          children: [NAV_ITEMS["menuItemsAdd"]],
        },
      ],
    },
  ],
};
