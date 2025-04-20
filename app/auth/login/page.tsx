"use client";
import {
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
// import DynamicMethods from "../../../components/Methods";

export default function AuthPage() {
  // Dynamic SDK code commented out
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Login to Your Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome to NFT IP Market
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-center text-gray-500">
            Connect your wallet to login
          </p>
          <div className="w-full flex items-center justify-center">
            <DynamicWidget innerButtonComponent={<>Connect Wallet</>} />
          </div>
        </div>
      </div>
      {/* Dynamic SDKの機能をテストするためのコード */}
      {/* <DynamicMethods /> */}
    </div>
  );
}
