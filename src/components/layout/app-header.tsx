"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { AppSidebar } from "./app-sidebar";

interface AppHeaderProps {
  title?: string;
  onSignOut?: () => void;
  userEmail?: string | null;
}

export function AppHeader({
  title = "Dashboard",
  onSignOut,
  userEmail,
}: AppHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-6">
      <Sheet>
        <SheetTrigger
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "lg:hidden",
          )}
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <AppSidebar />
        </SheetContent>
      </Sheet>

      <h2 className="text-lg font-semibold lg:text-xl">{title}</h2>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger
            className={buttonVariants({ variant: "outline", size: "icon" })}
          >
            <User className="h-4 w-4" />
            <span className="sr-only">User menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {userEmail ? (
              <DropdownMenuItem disabled>{userEmail}</DropdownMenuItem>
            ) : null}
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {onSignOut ? (
              <DropdownMenuItem onClick={onSignOut}>Sign out</DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => router.push("/login")}>
                Sign in
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
