import { ChartPie, LayoutDashboard, ScanQrCode } from "lucide-react";
import { type ReactNode } from "react";
import { type ApplicationRoute, ROUTES } from "~/app/_domain/routes";

type MenuItem = {
  icon: ReactNode;
  title: string;
  route: ApplicationRoute;
  parentId: "dashboard" | "locationManager";
};

export const menuItems: MenuItem[] = [
  {
    icon: <LayoutDashboard size={16} />,
    title: "Open orders",
    route: ROUTES.live,
    parentId: "dashboard",
  },
  {
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
  },
];
