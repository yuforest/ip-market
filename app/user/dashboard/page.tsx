"use client";

import { BarChart3, Edit, Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("my-projects");

  // Sample data
  const myProjects = [
    {
      id: "1",
      name: "CryptoKitties Japan",
      image: "/placeholder.svg?height=100&width=100",
      status: "listed",
      price: "15,000 USDC",
      category: "Art",
      createdAt: "May 15, 2023",
    },
    {
      id: "2",
      name: "Samurai Warriors",
      image: "/placeholder.svg?height=100&width=100",
      status: "draft",
      price: "-",
      category: "Game",
      createdAt: "June 20, 2023",
    },
  ];

  const purchasedProjects = [
    {
      id: "3",
      name: "Anime Avatars",
      image: "/placeholder.svg?height=100&width=100",
      purchaseDate: "August 10, 2023",
      price: "12,000 USDC",
      category: "Avatar",
    },
  ];

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your projects and purchases
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Registered Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myProjects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Listed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {myProjects.filter((p) => p.status === "listed").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Purchased</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {purchasedProjects.length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="my-projects" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-projects">My Projects</TabsTrigger>
            <TabsTrigger value="purchased">Purchase History</TabsTrigger>
          </TabsList>
          <TabsContent value="my-projects" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Registered Projects</h2>
              <Button asChild className="bg-rose-500 hover:bg-rose-600">
                <Link href="/register">Register New Project</Link>
              </Button>
            </div>

            {myProjects.length > 0 ? (
              <div className="space-y-4">
                {myProjects.map((project) => (
                  <Card key={project.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={project.image || "/placeholder.svg"}
                            alt={project.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{project.name}</h3>
                            <Badge
                              variant={
                                project.status === "listed"
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {project.status === "listed" ? "Listed" : "Draft"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span>Category: {project.category}</span>
                            <span>Created: {project.createdAt}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-rose-500">
                            {project.price}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/projects/${project.id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            {project.status === "listed" ? (
                              <Button variant="outline" size="sm">
                                Delist
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                className="bg-rose-500 hover:bg-rose-600"
                              >
                                List
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                  <p className="text-muted-foreground mb-4">
                    You haven't registered any projects yet
                  </p>
                  <Button asChild className="bg-rose-500 hover:bg-rose-600">
                    <Link href="/register">Register a Project</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="purchased" className="space-y-4">
            <h2 className="text-xl font-semibold">Purchase History</h2>

            {purchasedProjects.length > 0 ? (
              <div className="space-y-4">
                {purchasedProjects.map((project) => (
                  <Card key={project.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={project.image || "/placeholder.svg"}
                            alt={project.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold">{project.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span>Category: {project.category}</span>
                            <span>Purchased: {project.purchaseDate}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-rose-500">
                            {project.price}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/projects/${project.id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                Details
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm">
                              <BarChart3 className="h-4 w-4 mr-1" />
                              Analytics
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                  <p className="text-muted-foreground mb-4">
                    You haven't purchased any projects yet
                  </p>
                  <Button asChild className="bg-rose-500 hover:bg-rose-600">
                    <Link href="/marketplace">Browse Marketplace</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
