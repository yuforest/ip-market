import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/db";
import { nftProjects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ExternalLink } from "lucide-react";
import { marked } from "marked";
import { notFound } from "next/navigation";
import BuyNowButton from "./buy-now-button";

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  // Get project information from database
  const project = await db.query.nftProjects.findFirst({
    where: eq(nftProjects.id, id),
    with: {
      owner: true,
      listing: {
        with: {
          transaction: true,
        },
      },
      valuationReports: {
        orderBy: (reports, { desc }) => [desc(reports.createdAt)],
        limit: 1,
      },
      disclosures: true,
    },
  });

  // If project is not found, show 404 page
  if (!project) {
    notFound();
  }

  // Get price from listing information
  const price = project.listing
    ? `${project.listing.priceUSDC} USDC`
    : "Not for sale";

  const transaction = project.listing?.transaction;

  // Get listing information
  const listing = project.listing ? project.listing : null;

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12">
        {/* Left Column: Project Image */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-xl">
            <img
              src={project.image || "https://placehold.co/600x400"}
              alt={project.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Project Details</h2>
            <p className="text-gray-600">{project.description}</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Contract Address</p>
                <p className="font-mono text-sm flex items-center">
                  {project.collectionAddress.substring(0, 6)}...
                  {project.collectionAddress.substring(
                    project.collectionAddress.length - 4
                  )}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Owner</p>
                <p className="font-mono text-sm flex items-center">
                  {project.owner
                    ? project.owner.sub.substring(0, 6) + "..."
                    : "Unknown"}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Created</p>
                <p>{new Date(project.createdAt).toLocaleDateString("ja-JP")}</p>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <p className="text-sm prose">
              <div
                dangerouslySetInnerHTML={{
                  __html: marked(project.valuationReports[0].report) as string,
                }}
              />
            </p>
          </div>
        </div>

        {/* Right Column: Project Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {project.name}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{project.category}</Badge>
              <Badge variant="outline" className="bg-green-100">
                Listed
              </Badge>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Current Price</p>
                  <p className="text-3xl font-bold text-rose-500">{price}</p>
                </div>
                {listing && listing.saleId && project.status == "active" ? (
                  <BuyNowButton
                    project={project}
                    saleId={listing.saleId}
                    price={listing.priceUSDC}
                  />
                ) : (
                  <Button className="w-full" disabled>
                    Not for sale
                  </Button>
                )}
              </div>
              <div className="mb-4">
                <div className="pt-6 text-sm text-gray-600">
                  By making a purchase an escrow transaction is executed and the
                  owner of the NFT collection is transferred to the wallet you
                  used to log in.
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="stats">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="disclosures">Disclosures</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="stats" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Chain</p>
                      <p className="flex items-center">
                        <Badge variant="outline">{project.chainId}</Badge>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Last 12M Revenue</p>
                      <p className="font-medium">
                        {project.ltmRevenueUSD
                          ? `$${project.ltmRevenueUSD.toLocaleString()}`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {project.valuationReports &&
                project.valuationReports.length > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">
                        Latest Valuation Report
                      </h3>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">
                          Generated on{" "}
                          {new Date(
                            project.valuationReports[0].createdAt
                          ).toLocaleDateString("ja-JP")}
                        </p>
                        <p className="font-medium">
                          {project.valuationReports[0].estimatedValueUSD
                            ? `$${project.valuationReports[0].estimatedValueUSD.toLocaleString()}`
                            : "N/A"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {project.owner?.twitterUsername && project.owner?.twitterProfileImageUrl && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-medium mb-2">
                        Owner's Twitter Account
                      </h3>
                      <div className="flex items-center gap-2">
                        <img src={project.owner.twitterProfileImageUrl} alt={project.owner.twitterUsername} className="w-10 h-10 rounded-full" />
                        <p className="text-sm text-gray-500">{project.owner.twitterUsername}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
            </TabsContent>
            <TabsContent value="disclosures">
              {project.disclosures.map((disclosure) => {
                return (
                  <Card key={disclosure.id}>
                    <CardContent className="p-6">
                      <CardTitle>{disclosure.title}</CardTitle>
                      <CardDescription>
                        {disclosure.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
            <TabsContent value="history">
              <Card>
                <CardContent className="p-6">
                  {transaction == null && (
                    <p className="text-sm">
                      Transaction history will appear here
                    </p>
                  )}
                  {transaction != null && (
                    <div className="text-sm">
                      <p>
                        Date:{" "}
                        {transaction.createdAt.toLocaleDateString("ja-JP")}
                      </p>
                      <p>Tx Hash: {transaction.txHash}</p>
                      <p>Price: ${transaction.priceUSDC.toLocaleString()}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
