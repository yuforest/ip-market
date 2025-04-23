import {
  ArrowUpRight,
  BarChart3,
  Calendar,
  DollarSign,
  ExternalLink,
  Share2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";

export default async function ProjectDetailPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  // Sample project data
  const project = {
    id: params.id,
    name: "CryptoKitties Japan",
    description:
      "CryptoKitties Japan is an NFT collection featuring traditional Japanese cat characters. Each character has unique traits and rarity, making them popular among collectors.",
    image: "/placeholder.svg?height=500&width=500",
    price: "15,000 USDC",
    category: "Art",
    holders: 1200,
    volume: "120 ETH",
    royalty: "5%",
    createdAt: "May 2023",
    contractAddress: "0x1234...5678",
    ownerAddress: "0xabcd...ef01",
    socialLinks: {
      twitter: "https://twitter.com",
      discord: "https://discord.com",
      website: "https://example.com",
    },
    stats: {
      dailyVolume: "2.5 ETH",
      weeklyVolume: "18.3 ETH",
      monthlyVolume: "45.7 ETH",
      floorPrice: "0.15 ETH",
      items: 10000,
      listed: 120,
    },
  };

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12">
        {/* Left Column: Project Image */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-xl">
            <img
              src={project.image || "/placeholder.svg"}
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
                  {project.contractAddress.substring(0, 6)}...
                  {project.contractAddress.substring(
                    project.contractAddress.length - 4
                  )}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Owner Address</p>
                <p className="font-mono text-sm flex items-center">
                  {project.ownerAddress.substring(0, 6)}...
                  {project.ownerAddress.substring(
                    project.ownerAddress.length - 4
                  )}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Royalty</p>
                <p>{project.royalty}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Created</p>
                <p>{project.createdAt}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Project Info and Purchase Button */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="outline" className="mb-2">
                {project.category}
              </Badge>
              <h1 className="text-3xl font-bold">{project.name}</h1>
            </div>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <Users className="h-5 w-5 text-gray-500 mb-1" />
                <p className="text-sm text-gray-500">Holders</p>
                <p className="font-bold">{project.holders}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <BarChart3 className="h-5 w-5 text-gray-500 mb-1" />
                <p className="text-sm text-gray-500">Volume</p>
                <p className="font-bold">{project.volume}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <Calendar className="h-5 w-5 text-gray-500 mb-1" />
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-bold">{project.createdAt}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-medium">Sale Price</p>
                <p className="text-2xl font-bold text-rose-500">
                  {project.price}
                </p>
              </div>
              <Button className="w-full bg-rose-500 hover:bg-rose-600 mb-4">
                Purchase
                <DollarSign className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-sm text-gray-500 text-center">
                When you purchase, you'll receive IP ownership and smart
                contract management rights
              </p>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            {Object.entries(project.socialLinks).map(([key, url]) => (
              <Button key={key} variant="outline" size="sm" asChild>
                <Link
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </Button>
            ))}
          </div>

          <Tabs defaultValue="analytics">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
              <TabsTrigger value="history">Transaction History</TabsTrigger>
            </TabsList>
            <TabsContent value="analytics" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">24h Volume</p>
                  <p className="font-bold">{project.stats.dailyVolume}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">7d Volume</p>
                  <p className="font-bold">{project.stats.weeklyVolume}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">30d Volume</p>
                  <p className="font-bold">{project.stats.monthlyVolume}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Floor Price</p>
                  <p className="font-bold">{project.stats.floorPrice}</p>
                </div>
              </div>
              <div className="h-[200px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Volume Chart</p>
              </div>
            </TabsContent>
            <TabsContent value="community" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Total Items</p>
                  <p className="font-bold">{project.stats.items}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Listed</p>
                  <p className="font-bold">{project.stats.listed}</p>
                </div>
              </div>
              <div className="h-[200px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Holder Distribution Chart</p>
              </div>
            </TabsContent>
            <TabsContent value="history" className="space-y-4 pt-4">
              <div className="h-[250px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Transaction History Data</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
