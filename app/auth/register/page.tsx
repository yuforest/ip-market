"use client";
import { Wallet } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Label } from "@/components/ui/label"
// import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
// import { useEffect } from "react"

export default function RegisterPage() {
  // User type selection removed
  // const [userType, setUserType] = useState("buyer")

  // Dynamic SDK code commented out
  // const { handleConnect, isAuthenticated, user } = useDynamicContext()

  // // Redirect to dashboard if authenticated
  // useEffect(() => {
  //   if (isAuthenticated && user) {
  //     window.location.href = "/dashboard"
  //   }
  // }, [isAuthenticated, user])

  // Temporary wallet connect handler
  const handleWalletConnect = () => {
    // User type storage removed
    // localStorage.setItem("userType", userType)
    alert("Wallet connection feature is currently disabled.");
    // Add wallet connection logic here when implementing
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome to NFT IP Market
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-center text-gray-500">
            Connect your wallet to register
          </p>
          {/* User type selection removed */}
          <Button
            className="w-full flex items-center justify-center gap-2"
            onClick={handleWalletConnect}
          >
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </Button>
        </div>

        <div className="px-8 text-center text-sm text-muted-foreground">
          <div className="underline hover:text-primary">
            <Link href="/auth/login">Already have an account? Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
