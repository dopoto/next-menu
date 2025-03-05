import {
  LayoutDashboard,
  BetweenHorizontalStart,
  SquareMenu,
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
    url: "dashboard",
    parentId: "dashboard",
  },
  {
    icon: <BetweenHorizontalStart size={16} />,
    title: "Real-time orders",
    url: "dashboard/orders",
    parentId: "dashboard",
  },
  {
    icon: <SquareMenu size={16} />,
    title: "Menus",
    url: "manage/menus",
    parentId: "locationManager",
  },
];
