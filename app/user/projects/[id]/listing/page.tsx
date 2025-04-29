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
import { ProjectStatus } from "@/lib/db/enums";
import { Listing, NftProject, ValuationReport } from "@/lib/db/schema";
import { useSocialAccounts } from "@dynamic-labs/sdk-react-core";
import { ProviderEnum } from "@dynamic-labs/types";
import { AlertCircle, ExternalLink } from "lucide-react";
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
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [project, setProject] = useState<NftProject | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);
  const [valuationReport, setValuationReport] =
    useState<ValuationReport | null>(null);

  // Get project ID from URL parameters
  const params = useParams();
  const projectId = params?.id as string;
  const router = useRouter();

  // Use Wagmi hooks to get wallet client and account information
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const config = createConfig({
    chains: [soneiumMinato],
    transports: {
      [soneiumMinato.id]: http(),
    },
  });
  const publicClient = usePublicClient({ config });
  const { isLinked, getLinkedAccountInformation } = useSocialAccounts();

  const provider = ProviderEnum.Twitter;
  const isTwitterLinked = isLinked(provider);
  const connectedAccountInfo = getLinkedAccountInformation(provider);

  // Get existing listing for the project
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
      } catch (err) {
        console.error("Failed to get project information:", err);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!walletClient || !address) {
      setError("Wallet is not connected");
      setSubmitting(false);
      return;
    }

    if (!project) {
      setError("Project not found");
      setSubmitting(false);
      return;
    }

    try {
      // Convert price to USDC with 6 decimal places
      const priceInUSDC = parseUnits(price, 6);
      console.log("priceInUSDC", priceInUSDC);

      // Save listing information to backend
      if (listing?.id) {
        await walletClient.writeContract({
          address: escrowContractAddress as `0x${string}`,
          abi: escrowContractABI,
          functionName: "updateSalePrice",
          args: [listing.saleId, priceInUSDC],
        });

        // Update existing listing
        await fetch(`/api/user/listings/${listing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "active",
            priceUSDC: parseFloat(price),
          }),
        });
      } else {
        // Step 1: Set transferOwnership for the collection
        try {
          await walletClient.writeContract({
            address: project.collectionAddress as `0x${string}`,
            abi: erc721Abi,
            functionName: "transferOwnership",
            args: [escrowContractAddress as `0x${string}`],
          });

          // Wait for the ownership transfer transaction to complete
          await new Promise((resolve) => setTimeout(resolve, 5000));
        } catch (ownershipError) {
          console.error("Ownership transfer error:", ownershipError);
          setError(
            ownershipError instanceof Error
              ? ownershipError.message
              : "Failed to transfer ownership of the collection"
          );
          setSubmitting(false);
          return;
        }

        console.log("Ownership transfer completed. Starting listing.");

        // Step 2: Execute registerSale after approval
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

      // Update project status to active
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
      // Redirect to dashboard page
      router.push("/user/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Registration processing error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleStopListing = async () => {
    if (!walletClient || !address) {
      setError("Wallet is not connected");
      setSubmitting(false);
      return;
    }

    if (!project) {
      setError("Project not found");
      setSubmitting(false);
      return;
    }

    if (!listing) {
      setError("Listing not found");
      setSubmitting(false);
      return;
    }

    try {
      // Stop listing
      await walletClient.writeContract({
        address: escrowContractAddress as `0x${string}`,
        abi: escrowContractABI,
        functionName: "cancelSale",
        args: [listing.saleId],
      });
      // Update project status to suspended
      await fetch(`/api/user/projects/${projectId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "suspended",
          projectId: projectId,
        }),
      });
    } catch (error) {
      console.error("Listing stop error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Listing stop processing error"
      );
    }
    router.push("/user/dashboard");
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-3xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">List NFT Project</h1>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          To list a project, you must be the owner of the smart contract.
          Ownership verification will be performed after wallet connection.
          <br />
          When a listed NFT collection is purchased, the owner of the NFT
          collection becomes the buyer's wallet address.
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
                    <p className="font-medium font-mono">
                      {project.collectionAddress}
                    </p>
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
                    <p className="font-medium">
                      ${valuationReport?.estimatedValueUSD.toLocaleString()}
                    </p>
                  </div>
                  {isTwitterLinked ? (
                    <div className="col-span-2">
                      <p className="text-gray-500">X Account</p>
                      <p className="font-medium flex items-center">
                        <div className="icon mr-2">
                          <img src={connectedAccountInfo?.avatar || ""} />
                        </div>
                        <div className="mr-2">
                          {connectedAccountInfo?.displayName}
                        </div>
                        <div>
                          <a
                            href={
                              "https://x.com/" + connectedAccountInfo?.username
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink size={16} />
                          </a>
                        </div>
                      </p>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Desired Sale Price (USDC) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="100"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            className="bg-blue-500 hover:bg-blue-600"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Complete Registration"}
          </Button>
        </CardFooter>
      </Card>
      {project.status === ProjectStatus.ACTIVE && listing !== null && (
        <div className="flex justify-center mt-4">
          <Button
            onClick={handleStopListing}
            className="bg-red-500 hover:bg-red-600"
            size="sm"
            disabled={submitting}
          >
            {submitting ? "Stopping..." : "Stop Listing"}
          </Button>
        </div>
      )}
    </div>
  );
}
