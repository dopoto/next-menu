import {
  ChartPie,
  LayoutDashboard,
  ScanQrCode,
} from "lucide-react";
import { type ReactNode } from "react";

type MenuItem = {
  icon: ReactNode;
  title: string;
  url: string;
  parentId: "dashboard" | "locationManager";
};

export const menuItems: MenuItem[] = [
  {
    icon: <LayoutDashboard size={16} />,
    title: "Open orders",
    url: "live",
    parentId: "dashboard",
  },
  {
    icon: <ChartPie size={16} />,
    title: "Reports",
    url: "reports",
    parentId: "dashboard",
  },
  {
    icon: <ScanQrCode size={16} />,
    title: "Menus",
    url: "manage/menus",
    parentId: "locationManager",
  },
];
