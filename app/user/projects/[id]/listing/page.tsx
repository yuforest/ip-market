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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { escrowContractABI } from "@/constants/abis";
import { escrowContractAddress } from "@/constants/contracts";
import { AlertCircle, ArrowRight, Upload } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { parseUnits } from "viem";
import { useAccount, useWalletClient } from "wagmi";

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
];

export default function RegisterProjectPage() {
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [listingId, setListingId] = useState<string | null>(null);

  // URLパラメータからプロジェクトIDを取得
  const params = useParams();
  const projectId = params?.id as string;
  const router = useRouter();

  // Wagmi フックを使用してウォレットクライアントとアカウント情報を取得
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();

  // プロジェクトの既存リスティングを取得
  useEffect(() => {
    const fetchListingData = async () => {
      if (!projectId) return;

      try {
        // プロジェクトのリスティング情報を取得
        const response = await fetch(`/api/listings?projectId=${projectId}`);
        const data = await response.json();

        // リスティングが存在する場合、そのIDを保存
        if (data.listings && data.listings.length > 0) {
          setListingId(data.listings[0].id);
        }
      } catch (err) {
        console.error("リスティング情報の取得に失敗:", err);
      }
    };

    fetchListingData();
  }, [projectId]);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!walletClient || !address) {
      setError("ウォレットが接続されていません");
      setSubmitting(false);
      return;
    }

    console.log("price", price);
    console.log("contractAddress", contractAddress);

    try {
      // コレクションアドレスの設定（contractAddressを使用）
      const collectionAddress = contractAddress as `0x${string}`;

      // 価格をUSDCの小数点に変換（6桁）
      const priceInUSDC = parseUnits(price, 6);
      console.log("priceInUSDC", priceInUSDC);

      // ステップ1: コレクションに対するERC721 approvalForAllを設定
      try {
        const approvalTx = await walletClient.writeContract({
          address: collectionAddress,
          abi: erc721Abi,
          functionName: "setApprovalForAll",
          args: [escrowContractAddress as `0x${string}`, true],
        });

        // 承認トランザクションの完了を待つ
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } catch (approvalError) {
        console.error("ERC721承認エラー:", approvalError);
        setError(
          approvalError instanceof Error
            ? approvalError.message
            : "ERC721承認エラー"
        );
        setSubmitting(false);
        return;
      }

      console.log("承認が完了しました。リスティングを開始します。");

      // ステップ2: 承認完了後にregisterSaleを実行
      await walletClient.writeContract({
        address: escrowContractAddress as `0x${string}`,
        abi: escrowContractABI,
        functionName: "registerSale",
        args: [collectionAddress, priceInUSDC],
      });
      // バックエンドにリスティング情報を保存
      if (listingId) {
        // 既存のリスティングを更新
        await fetch(`/api/listings/${listingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "active",
            priceUSDC: parseFloat(price),
            escrowAddress: escrowContractAddress,
          }),
        });
      } else {
        await fetch(`/api/listings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId,
            status: "active",
            priceUSDC: parseFloat(price),
            escrowAddress: escrowContractAddress,
          }),
        });
      }

      // プロジェクトのステータスをactiveに更新
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "active",
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

  return (
    <div className="container max-w-3xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Register NFT Project</h1>
        <p className="text-muted-foreground mt-2">
          List your NFT project on the marketplace
        </p>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          To register a project, you must be the owner of the smart contract.
          Ownership verification will be performed after wallet connection.
        </AlertDescription>
      </Alert>

      <div className="mb-8">
        <div className="relative">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    step >= i
                      ? "bg-rose-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i}
                </div>
                <span className="mt-2 text-xs text-gray-500">
                  {i === 1
                    ? "Basic Info"
                    : i === 2
                    ? "Details"
                    : "Review & Submit"}
                </span>
              </div>
            ))}
            <div className="absolute top-5 left-0 right-0 h-[2px] -z-10">
              <div className="h-full bg-gray-200">
                <div
                  className="h-full bg-rose-500 transition-all duration-300"
                  style={{ width: `${((step - 1) / 2) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1
              ? "Project Basic Information"
              : step === 2
              ? "Project Details"
              : "Review & Submit"}
          </CardTitle>
          <CardDescription>
            {step === 1
              ? "Enter the basic information about your project"
              : step === 2
              ? "Enter detailed information"
              : "Review your information and complete registration"}
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

          {success && step === 3 && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                プロジェクトが正常に登録されました！トランザクションの完了をお待ちください。
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name *</Label>
                  <Input
                    id="projectName"
                    placeholder="e.g., CryptoKitties Japan"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contractAddress">Contract Address *</Label>
                  <Input
                    id="contractAddress"
                    placeholder="0x..."
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="art">Art</SelectItem>
                      <SelectItem value="collectible">Collectible</SelectItem>
                      <SelectItem value="game">Game</SelectItem>
                      <SelectItem value="entertainment">
                        Entertainment
                      </SelectItem>
                      <SelectItem value="avatar">Avatar</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Project Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter a description of your project"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projectImage">Project Image</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      Drag & drop an image, or
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Select File
                    </Button>
                    <p className="text-xs text-gray-400 mt-2">
                      Recommended: 1000x1000px, max 5MB
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Social Links</Label>
                  <div className="space-y-2">
                    <Input placeholder="Twitter URL" />
                    <Input placeholder="Discord URL" />
                    <Input placeholder="Website URL" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Desired Sale Price (USDC)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g., 10000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    * Can be adjusted after AI valuation
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="font-medium mb-2">Project Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Project Name</p>
                      <p className="font-medium">{projectName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Category</p>
                      <p className="font-medium">{category}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Contract Address</p>
                      <p className="font-medium font-mono">{contractAddress}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Description</p>
                      <p className="font-medium">{description}</p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    After registration, an AI-powered analysis will be performed
                    and a detailed report will be generated. You can list your
                    project after the report is complete.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={handlePrevStep}>
              Back
            </Button>
          ) : (
            <div></div>
          )}
          {step < 3 ? (
            <Button onClick={handleNextStep}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              className="bg-rose-500 hover:bg-rose-600"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Complete Registration"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
