import {
  ChartPie,
  LayoutDashboardIcon,
  ScanQrCodeIcon,
  UtensilsCrossedIcon,
} from "lucide-react";
import { type ReactNode } from "react";
import { type AppRouteKey, ROUTES } from "~/app/_domain/routes";

type RouteId =
  | "ROOT"
  | "dashboard"
  | "locationManager"
  | "live"
  | "reports"
  | "menus"
  | "menusAdd"
  | "menuItems"
  | "menuItemsAdd";

type MenuItem = {
  id: RouteId;
  icon?: ReactNode;
  title?: string;
  route?: AppRouteKey;
  children?: MenuItem[];
};

export const menuTree: MenuItem = {
  id: "ROOT",
  children: [
    {
      id: "dashboard",
      children: [
        {
          id: "live",
          icon: <LayoutDashboardIcon size={16} />,
          title: "Open orders",
          route: ROUTES.live,
        },
        {
          id: "reports",
          icon: <ChartPie size={16} />,
          title: "Reports",
          route: ROUTES.reports,
        },
      ],
    },
    {
      id: "locationManager",
      children: [
        {
          id: "menus",
          icon: <ScanQrCodeIcon size={16} />,
          title: "Menus",
          route: ROUTES.menus,
          children: [
            {
              id: "menusAdd",
              title: "Add menu",
              route: ROUTES.menusAdd,
            },
          ],
        },
        {
          id: "menuItems",
          icon: <UtensilsCrossedIcon size={16} />,
          title: "Dishes & Drinks",
          route: ROUTES.menuItems,
          children: [
            {
              id: "menuItemsAdd",
              title: "Add menu item",
              route: ROUTES.menuItemsAdd,
            },
          ],
        },
      ],
    },
  ],
};
