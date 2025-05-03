"use client";

import { MainNav } from "@/components/main-nav";
import { Button } from "@/components/ui/button";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Suspense } from "react";

const Header = () => {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl">NFT IP Market</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Suspense>
            <MainNav />
          </Suspense>
          <div className="flex items-center gap-2 ml-4">
            {/* Notification icon with link */}
            {isAuthenticated && (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/notifications">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Link>
              </Button>
            )}

            <DynamicWidget innerButtonComponent={<>Connect Wallet</>} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
