import Link from "next/link";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter } from "./ui/card";

export default function FeaturedProjects() {
  // Sample projects
  const projects = [
    {
      id: "1",
      name: "CryptoKitties Japan",
      image: "https://placeholder.pics/svg/500",
      price: "15,000 USDC",
      category: "Art",
      holders: 1200,
      volume: "120 ETH",
    },
    {
      id: "2",
      name: "Manga Heroes",
      image: "https://placeholder.pics/svg/500",
      price: "25,000 USDC",
      category: "Entertainment",
      holders: 3500,
      volume: "350 ETH",
    },
    {
      id: "3",
      name: "Tokyo Punks",
      image: "https://placeholder.pics/svg/500",
      price: "18,000 USDC",
      category: "Collectibles",
      holders: 2200,
      volume: "180 ETH",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Featured Projects
            </h2>
            <p className="text-gray-500 mt-1">Popular NFT IP Collections</p>
          </div>
          <Link
            href="/projects"
            className="text-rose-500 hover:text-rose-600 font-medium mt-2 md:mt-0"
          >
            View All →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                      <p className="font-bold text-rose-500">{project.price}</p>
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
    </section>
  );
}
