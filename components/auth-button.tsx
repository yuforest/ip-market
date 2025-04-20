"use client";

import { Wallet } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
// import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
// import { LogOut } from 'lucide-react'

export function AuthButton() {
  // Dynamic SDK code commented out
  // const { isAuthenticated, handleLogOut, handleConnect } = useDynamicContext()

  // if (isAuthenticated) {
  //   return (
  //     <Button variant="outline" className="hidden md:flex" onClick={handleLogOut}>
  //       <LogOut className="mr-2 h-4 w-4" />
  //       Logout
  //     </Button>
  //   )
  // }

  // Static login button
  return (
    <Button asChild className="hidden md:flex bg-rose-500 hover:bg-rose-600">
      <Link href="/auth/login">
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Link>
    </Button>
  );
}
