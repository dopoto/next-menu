import {
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
    title: "Dashboard",
    url: "live",
    parentId: "dashboard",
  },
  {
    icon: <ScanQrCode size={16} />,
    title: "Menus",
    url: "manage/menus",
    parentId: "locationManager",
  },
];
