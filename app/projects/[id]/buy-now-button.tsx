"use client";

import { Button } from "@/components/ui/button";
import { escrowContractABI } from "@/constants/abis";
import { escrowContractAddress } from "@/constants/contracts";
import { useState } from "react";
import { useAccount, useWalletClient } from "wagmi";

interface BuyNowButtonProps {
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

export default function BuyNowButton({ saleId, price }: BuyNowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();

  if (!walletClient || !address) {
    return;
  }

  const handleBuy = async () => {
    console.log("price", price);
    await walletClient.writeContract({
      address: "0xE9A198d38483aD727ABC8b0B1e16B2d338CF0391" as `0x${string}`,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [escrowContractAddress, BigInt(price * 10 ** 6)],
    });

    await walletClient.writeContract({
      address: escrowContractAddress as `0x${string}`,
      abi: escrowContractABI,
      functionName: "buy",
      args: [saleId],
    });

    setIsLoading(true);
  };

  return (
    <Button onClick={handleBuy} disabled={isLoading}>
      {isLoading ? "処理中..." : "購入する"}
    </Button>
  );
}
