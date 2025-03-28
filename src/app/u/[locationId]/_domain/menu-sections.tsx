import { ChartPie, LayoutDashboard, ScanQrCode } from "lucide-react";
import { type ReactNode } from "react";
import { type AppRouteKey, ROUTES } from "~/app/_domain/routes";

type RouteId =
  | "ROOT"
  | "dashboard"
  | "locationManager"
  | "live"
  | "reports"
  | "menus"
  | "menusAdd";

type MenuItem = {
  id: RouteId;
  icon?: ReactNode;
  title?: string;
  route?: AppRouteKey;
  parentId?: RouteId;
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
          icon: <LayoutDashboard size={16} />,
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
          icon: <ScanQrCode size={16} />,
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
      ],
    },
  ],
};

export const menuItems: MenuItem[] = [
  {
    id: "live",
    icon: <LayoutDashboard size={16} />,
    title: "Open orders",
    route: ROUTES.live,
    parentId: "dashboard",
  },
  {
    id: "ROOT",
    icon: <ChartPie size={16} />,
    title: "Reports",
    route: ROUTES.reports,
    parentId: "dashboard",
  },
  {
    icon: <ScanQrCode size={16} />,
    title: "Menus",
    route: ROUTES.menus,
    parentId: "locationManager",
    id: "ROOT",
  },
];
