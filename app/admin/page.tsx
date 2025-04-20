"use client";

import {
  BarChart3,
  CheckCircle,
  DollarSign,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("projects");

  // Sample data
  const pendingProjects = [
    {
      id: "1",
      name: "CryptoKitties Japan",
      owner: "0x1234...5678",
      status: "pending_review",
      submittedAt: "May 15, 2023",
    },
    {
      id: "2",
      name: "Samurai Warriors",
      owner: "0xabcd...ef01",
      status: "pending_review",
      submittedAt: "June 20, 2023",
    },
  ];

  const transactions = [
    {
      id: "tx1",
      projectName: "Anime Avatars",
      seller: "0x2345...6789",
      buyer: "0x3456...7890",
      amount: "12,000 USDC",
      date: "August 10, 2023",
      status: "completed",
    },
    {
      id: "tx2",
      projectName: "Digital Landscapes",
      seller: "0x4567...8901",
      buyer: "0x5678...9012",
      amount: "8,500 USDC",
      date: "July 25, 2023",
      status: "completed",
    },
    {
      id: "tx3",
      projectName: "Crypto Samurai",
      seller: "0x6789...0123",
      buyer: "0x7890...1234",
      amount: "30,000 USDC",
      date: "September 5, 2023",
      status: "pending",
    },
  ];

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Platform management and analytics
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">125,500 USDC</div>
              <p className="text-xs text-muted-foreground">
                +23% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Fee Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,765 USDC</div>
              <p className="text-xs text-muted-foreground">
                +23% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="projects">Project Approval</TabsTrigger>
            <TabsTrigger value="transactions">Transaction History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="projects" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Pending Projects</h2>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search projects..."
                  className="pl-8"
                />
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">
                          {project.name}
                        </TableCell>
                        <TableCell>{project.owner}</TableCell>
                        <TableCell>{project.submittedAt}</TableCell>
                        <TableCell>
                          <Badge variant="outline">Pending Review</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/projects/${project.id}`}>
                                Details
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive">
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="transactions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Transaction History</h2>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="pl-8"
                />
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-medium">
                          {tx.projectName}
                        </TableCell>
                        <TableCell>{tx.seller}</TableCell>
                        <TableCell>{tx.buyer}</TableCell>
                        <TableCell>{tx.amount}</TableCell>
                        <TableCell>{tx.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              tx.status === "completed" ? "default" : "outline"
                            }
                          >
                            {tx.status === "completed"
                              ? "Completed"
                              : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-rose-500" />
                    Volume Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                    <p className="text-gray-500">Volume Chart</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-teal-500" />
                    User Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                    <p className="text-gray-500">User Statistics Chart</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-amber-500" />
                    Volume by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                    <p className="text-gray-500">Category Chart</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Platform Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Total Projects</p>
                        <p className="font-bold">24</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">
                          Total Transactions
                        </p>
                        <p className="font-bold">18</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">
                          Average Transaction
                        </p>
                        <p className="font-bold">16,500 USDC</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">
                          Highest Transaction
                        </p>
                        <p className="font-bold">30,000 USDC</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Download Detailed Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
