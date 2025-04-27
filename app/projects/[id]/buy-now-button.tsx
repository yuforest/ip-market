"use client";

import { Button } from "@/components/ui/button";
import { escrowContractABI } from "@/constants/abis";
import { escrowContractAddress } from "@/constants/contracts";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAccount, useWalletClient } from "wagmi";

interface BuyNowButtonProps {
  projectId: string;
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
  projectId,
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

      // USDCの承認トランザクション
      await walletClient.writeContract({
        address: "0xE9A198d38483aD727ABC8b0B1e16B2d338CF0391" as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [escrowContractAddress, BigInt(price * 10 ** 6)],
      });

      // 購入トランザクションの実行
      const txHash = await walletClient.writeContract({
        address: escrowContractAddress as `0x${string}`,
        abi: escrowContractABI,
        functionName: "buy",
        args: [saleId],
      });

      // バックエンドAPIを呼び出してDBを更新
      const response = await fetch(`/api/projects/${projectId}/purchase`, {
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
        throw new Error(errorData.error || "購入処理に失敗しました");
      }

      router.push("/user/dashboard");
    } catch (error) {
      console.error("購入処理中にエラーが発生しました:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleBuy} disabled={isLoading}>
      {isLoading ? "処理中..." : "購入する"}
    </Button>
  );
}
