"use client";

import type React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { escrowContractABI } from "@/constants/abis";
import { escrowContractAddress } from "@/constants/contracts";
import { AlertCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { http, parseUnits } from "viem";
import { soneiumMinato } from "viem/chains";
import {
  createConfig,
  useAccount,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import { Listing, NftProject, ValuationReport } from "@/lib/db/schema";

// ERC721のABIのみを定義
const erc721Abi = [
  {
    name: "setApprovalForAll",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "operator", type: "address" },
      { name: "approved", type: "bool" },
    ],
    outputs: [],
  },
  {
    name: "isApprovedForAll",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "operator", type: "address" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "transferOwnership",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "newOwner", type: "address" }],
    outputs: [],
  },
];

export default function RegisterProjectPage() {
  // const [projectName, setProjectName] = useState("");
  // const [collectionAddress, setCollectionAddress] = useState("");
  // const [description, setDescription] = useState("");
  // const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  // const [listingId, setListingId] = useState<string | null>(null);
  const [project, setProject] = useState<NftProject | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);
  const [valuationReport, setValuationReport] = useState<ValuationReport | null>(null);

  // URLパラメータからプロジェクトIDを取得
  const params = useParams();
  const projectId = params?.id as string;
  const router = useRouter();

  // Wagmi フックを使用してウォレットクライアントとアカウント情報を取得
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const config = createConfig({
    chains: [soneiumMinato],
    transports: {
      [soneiumMinato.id]: http(),
    },
  });
  const publicClient = usePublicClient({ config });
  // プロジェクトの既存リスティングを取得
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/projects/${projectId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        console.log(data);

        if (response.status == 200) {
          setProject(data);
          setListing(data.listing);
          setPrice(data.listing?.priceUSDC?.toString() || "");
          setValuationReport(data.valuationReports[0]);
        }
        console.log(valuationReport);
      } catch (err) {
        console.error("プロジェクト情報の取得に失敗:", err);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!walletClient || !address) {
      setError("ウォレットが接続されていません");
      setSubmitting(false);
      return;
    }

    if (!project) {
      setError("プロジェクトが見つかりません");
      setSubmitting(false);
      return;
    }

    try {
      // 価格をUSDCの小数点に変換（6桁）
      const priceInUSDC = parseUnits(price, 6);
      console.log("priceInUSDC", priceInUSDC);

      // ステップ1: コレクションに対するtransferOwnershipを設定
      try {
        await walletClient.writeContract({
          address: project.collectionAddress as `0x${string}`,
          abi: erc721Abi,
          functionName: "transferOwnership",
          args: [escrowContractAddress as `0x${string}`],
        });

        // 所有権移転トランザクションの完了を待つ
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } catch (ownershipError) {
        console.error("所有権移転エラー:", ownershipError);
        setError(
          ownershipError instanceof Error
            ? ownershipError.message
            : "コレクションの所有権移転に失敗しました"
        );
        setSubmitting(false);
        return;
      }

      console.log("所有権移転が完了しました。リスティングを開始します。");

      // ステップ2: 承認完了後にregisterSaleを実行
      await walletClient.writeContract({
        address: escrowContractAddress as `0x${string}`,
        abi: escrowContractABI,
        functionName: "registerSale",
        args: [project.collectionAddress, priceInUSDC],
      });

      const saleId = await publicClient.readContract({
        address: escrowContractAddress as `0x${string}`,
        abi: escrowContractABI,
        functionName: "getSaleId",
      });
      console.log("Sale ID:", saleId);
      // バックエンドにリスティング情報を保存
      if (listing?.id) {
        // 既存のリスティングを更新
        await fetch(`/api/user/listings/${listing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "active",
            saleId: Number(saleId),
            priceUSDC: parseFloat(price),
            escrowAddress: escrowContractAddress,
          }),
        });
      } else {
        await fetch(`/api/user/listings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId,
            status: "active",
            saleId: Number(saleId),
            priceUSDC: parseFloat(price),
            escrowAddress: escrowContractAddress,
          }),
        });
      }

      // プロジェクトのステータスをactiveに更新
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/projects/${projectId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "active",
            projectId: projectId,
          }),
        }
      );

      setSuccess(true);
      // ダッシュボード画面に遷移
      router.push("/user/dashboard");
    } catch (error) {
      console.error("登録エラー:", error);
      setError(
        error instanceof Error
          ? error.message
          : "登録処理中にエラーが発生しました"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-3xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">List NFT Project</h1>
        <p className="text-muted-foreground mt-2">
          List your NFT project on the marketplace
        </p>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          To list a project, you must be the owner of the smart contract.
          Ownership verification will be performed after wallet connection.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>
            Check reoprt about your project and input sale price
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-600">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                Project successfully registered! Please wait for the transaction
                to complete.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-medium mb-2">Project Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Project Name</p>
                    <p className="font-medium">{project.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Category</p>
                    <p className="font-medium">{project.category}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Contract Address</p>
                    <p className="font-medium font-mono">{project.collectionAddress}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Description</p>
                    <p className="font-medium">{project.description}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Report</p>
                    <p className="font-medium">{valuationReport?.report}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Estimated Value</p>
                    <p className="font-medium">{valuationReport?.estimatedValueUSD}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Desired Sale Price (USDC) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="100 $"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            className="bg-rose-500 hover:bg-rose-600"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Complete Registration"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
