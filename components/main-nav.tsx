"use client";

import { Bell, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export function MainNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/marketplace",
      label: "Marketplace",
      active: pathname === "/marketplace",
    },
    {
      href: "/user/projects/new",
      label: "Register Project",
      active: pathname === "/user/projects/new",
    },
    {
      href: "/user/dashboard",
      label: "My Dashboard",
      active: pathname === "/user/dashboard",
    },
  ];

  return (
    <div className="flex items-center">
      <div className="hidden md:flex items-center gap-6">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              route.active
                ? "text-black font-semibold"
                : "text-muted-foreground"
            )}
          >
            {route.label}
          </Link>
        ))}
      </div>
      <div className="flex md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="flex flex-col gap-4 mt-8">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "text-base font-medium transition-colors hover:text-primary p-2",
                    route.active
                      ? "text-black font-semibold bg-gray-100 rounded-md"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {route.label}
                </Link>
              ))}

              {/* Mobile icon links */}
              <div className="flex flex-col gap-2 mt-4 border-t pt-4">
                <Link
                  href="/notifications"
                  className="flex items-center gap-2 p-2 text-muted-foreground hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
