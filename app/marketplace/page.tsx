import { Filter, Search } from "lucide-react";
import Link from "next/link";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Slider } from "../../components/ui/slider";

export default function MarketplacePage() {
  // Sample projects
  const projects = [
    {
      id: "1",
      name: "CryptoKitties Japan",
      image: "/placeholder.svg?height=300&width=300",
      price: "15,000 USDC",
      category: "Art",
      holders: 1200,
      volume: "120 ETH",
    },
    {
      id: "2",
      name: "Manga Heroes",
      image: "/placeholder.svg?height=300&width=300",
      price: "25,000 USDC",
      category: "Entertainment",
      holders: 3500,
      volume: "350 ETH",
    },
    {
      id: "3",
      name: "Tokyo Punks",
      image: "/placeholder.svg?height=300&width=300",
      price: "18,000 USDC",
      category: "Collectibles",
      holders: 2200,
      volume: "180 ETH",
    },
    {
      id: "4",
      name: "Anime Avatars",
      image: "/placeholder.svg?height=300&width=300",
      price: "12,000 USDC",
      category: "Avatars",
      holders: 1800,
      volume: "95 ETH",
    },
    {
      id: "5",
      name: "Crypto Samurai",
      image: "/placeholder.svg?height=300&width=300",
      price: "30,000 USDC",
      category: "Gaming",
      holders: 4200,
      volume: "420 ETH",
    },
    {
      id: "6",
      name: "Digital Landscapes",
      image: "/placeholder.svg?height=300&width=300",
      price: "8,500 USDC",
      category: "Art",
      holders: 950,
      volume: "65 ETH",
    },
  ];

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground">Discover NFT IP Collections</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by project name, category..."
              className="w-full pl-8"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Select defaultValue="newest">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="holders">Holders</SelectItem>
                <SelectItem value="volume">Volume</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter Panel */}
        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          <div className="space-y-6 rounded-lg border p-4">
            <div>
              <h3 className="mb-4 text-lg font-medium">Categories</h3>
              <div className="space-y-2">
                {[
                  "Art",
                  "Collectibles",
                  "Gaming",
                  "Entertainment",
                  "Avatars",
                  "Other",
                ].map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox id={`category-${category}`} />
                    <Label htmlFor={`category-${category}`}>{category}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t pt-4">
              <h3 className="mb-4 text-lg font-medium">Price Range</h3>
              <div className="space-y-4">
                <Slider
                  defaultValue={[0, 50000]}
                  min={0}
                  max={50000}
                  step={1000}
                />
                <div className="flex items-center justify-between">
                  <Input type="number" placeholder="Min" className="w-[45%]" />
                  <span>-</span>
                  <Input type="number" placeholder="Max" className="w-[45%]" />
                </div>
                <Button variant="outline" className="w-full">
                  Apply
                </Button>
              </div>
            </div>
            <div className="border-t pt-4">
              <h3 className="mb-4 text-lg font-medium">Holders</h3>
              <div className="space-y-2">
                {[
                  "Under 1,000",
                  "1,000-3,000",
                  "3,000-5,000",
                  "Over 5,000",
                ].map((range) => (
                  <div key={range} className="flex items-center space-x-2">
                    <Checkbox id={`holders-${range}`} />
                    <Label htmlFor={`holders-${range}`}>{range}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Projects List */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link href={`/projects/${project.id}`} key={project.id}>
                <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.name}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{project.name}</h3>
                        <Badge variant="outline" className="mt-1">
                          {project.category}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-rose-500">
                          {project.price}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between text-sm text-gray-500">
                    <span>Holders: {project.holders}</span>
                    <span>Volume: {project.volume}</span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
