import { BarChart3, Download, Share2, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";

export default function ProjectReportPage({
  params,
}: {
  params: { id: string };
}) {
  // Sample project data
  const project = {
    id: params.id,
    name: "CryptoKitties Japan",
    image: "/placeholder.svg?height=200&width=200",
    price: "15,000 USDC",
    category: "Art",
    holders: 1200,
    volume: "120 ETH",
    royalty: "5%",
    createdAt: "May 2023",
    contractAddress: "0x1234...5678",
    ownerAddress: "0xabcd...ef01",
    stats: {
      dailyVolume: "2.5 ETH",
      weeklyVolume: "18.3 ETH",
      monthlyVolume: "45.7 ETH",
      floorPrice: "0.15 ETH",
      items: 10000,
      listed: 120,
    },
    aiScore: {
      overall: 85,
      community: 78,
      liquidity: 92,
      uniqueness: 88,
      potential: 82,
    },
  };

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{project.category}</Badge>
              <Badge className="bg-rose-500">AI Analysis Report</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              {project.name}
            </h1>
            <p className="text-muted-foreground">Detailed Project Analysis</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Download PDF
            </Button>
            <Button size="sm" asChild>
              <Link href={`/projects/${project.id}`}>View Project</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-center">
                    {project.name}
                  </h2>
                  <p className="text-center text-gray-500 mb-4">
                    {project.category}
                  </p>
                  <div className="w-full border-t pt-4 mt-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500">Valuation:</span>
                      <span className="font-bold text-rose-500">
                        {project.price}
                      </span>
                    </div>
                    <Button className="w-full bg-rose-500 hover:bg-rose-600">
                      Purchase
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Overall Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-bold">
                        {project.aiScore.overall}
                      </span>
                    </div>
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#f1f5f9"
                        strokeWidth="10"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#f43f5e"
                        strokeWidth="10"
                        strokeDasharray="283"
                        strokeDashoffset={
                          283 - (283 * project.aiScore.overall) / 100
                        }
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                  <div className="w-full space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Community</span>
                        <span>{project.aiScore.community}/100</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rose-500"
                          style={{ width: `${project.aiScore.community}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Liquidity</span>
                        <span>{project.aiScore.liquidity}/100</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rose-500"
                          style={{ width: `${project.aiScore.liquidity}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Uniqueness</span>
                        <span>{project.aiScore.uniqueness}/100</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rose-500"
                          style={{ width: `${project.aiScore.uniqueness}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Potential</span>
                        <span>{project.aiScore.potential}/100</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rose-500"
                          style={{ width: `${project.aiScore.potential}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="community">Community</TabsTrigger>
                <TabsTrigger value="financials">Financial Analysis</TabsTrigger>
                <TabsTrigger value="forecast">Future Forecast</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-6 pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-rose-500" />
                      Project Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        CryptoKitties Japan is an NFT collection featuring
                        traditional Japanese cat characters. Launched in May
                        2023, it has shown steady growth to date. The community
                        is active and holder loyalty is high.
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Total Supply</p>
                          <p className="font-bold">{project.stats.items}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Holders</p>
                          <p className="font-bold">{project.holders}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Total Volume</p>
                          <p className="font-bold">{project.volume}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Royalty</p>
                          <p className="font-bold">{project.royalty}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-rose-500" />
                        Trading Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                        <p className="text-gray-500">Volume Chart</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="h-5 w-5 mr-2 text-rose-500" />
                        Holder Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                        <p className="text-gray-500">
                          Holder Distribution Chart
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>AI Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      CryptoKitties Japan is rated as a high-quality project
                      with stable trading volume and an active community. It has
                      particularly strong recognition in the Japanese market,
                      and with the expansion of the NFT market in Asia, its
                      value is expected to increase. Royalty income is stable,
                      and there is high potential for IP utilization, making it
                      a valuable investment.
                    </p>
                    <div className="mt-4 p-4 bg-rose-50 rounded-lg border border-rose-100">
                      <h4 className="font-bold text-rose-800 mb-2">
                        Recommended Actions
                      </h4>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>
                          Consider collaborations with the gaming industry
                        </li>
                        <li>Strengthen marketing in Asian markets</li>
                        <li>Host regular community events</li>
                        <li>Explore metaverse expansion opportunities</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="community" className="pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Community Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                      <p className="text-gray-500">Community Analysis Data</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="financials" className="pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                      <p className="text-gray-500">Financial Analysis Data</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="forecast" className="pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Future Forecast</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                      <p className="text-gray-500">Future Forecast Data</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
