"use client";

import { Button } from "@/components/ui/button";
import { escrowContractABI } from "@/constants/abis";
import { escrowContractAddress } from "@/constants/contracts";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAccount, useWalletClient } from "wagmi";

interface BuyNowButtonProps {
  project: any;
  saleId: number;
  price: number;
}

// ERC20 トークンの ABI（approve 関数のみ抜粋）
const ERC20_ABI = [
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
];

export default function BuyNowButton({
  project,
  saleId,
  price,
}: BuyNowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const router = useRouter();
  if (!walletClient || !address) {
    return null;
  }

  const handleBuy = async () => {
    try {
      setIsLoading(true);

      // USDC approval transaction
      await walletClient.writeContract({
        address: "0xE9A198d38483aD727ABC8b0B1e16B2d338CF0391" as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [escrowContractAddress, BigInt(price * 10 ** 6)],
      });

      // Execute purchase transaction
      const txHash = await walletClient.writeContract({
        address: escrowContractAddress as `0x${string}`,
        abi: escrowContractABI,
        functionName: "buy",
        args: [saleId],
      });

      // Call backend API to update DB
      const response = await fetch(`/api/projects/${project.id}/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          txHash: txHash,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Purchase failed");
      }

      router.push("/user/dashboard");
    } catch (error) {
      console.error("Error during purchase:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleBuy} disabled={isLoading}>
      {isLoading ? "Processing..." : "Buy Now"}
    </Button>
  );
}
