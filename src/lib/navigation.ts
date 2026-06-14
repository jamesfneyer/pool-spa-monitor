import {
  Beaker,
  ClipboardList,
  Droplets,
  LayoutDashboard,
  NotebookPen,
  Settings,
  Wrench,
} from "lucide-react";

export const mainNavItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Water Tests", href: "/water-tests", icon: Beaker },
  { title: "Chemical Dosing", href: "/chemical-dosing", icon: Droplets },
  { title: "Equipment", href: "/equipment", icon: Wrench },
  { title: "Maintenance", href: "/maintenance", icon: ClipboardList },
  { title: "Notes", href: "/notes", icon: NotebookPen },
  { title: "Settings", href: "/settings", icon: Settings },
] as const;
