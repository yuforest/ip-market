import Link from "next/link";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter } from "./ui/card";
import { nftProjects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { ProjectStatus } from "@/lib/db/enums";
import { Button } from "./ui/button";

export default async function FeaturedProjects() {

  const projects = await db.query.nftProjects.findMany({
    where: eq(nftProjects.status, ProjectStatus.ACTIVE),
    limit: 3,
    with: {
      listing: true,
    },
  })

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
                  src={
                    project.metadataCID
                      ? `https://ipfs.io/ipfs/${project.metadataCID}`
                      : "https://placehold.co/600x400"
                  }
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
                      {project.listing
                        ? `${project.listing.priceUSDC} USDC`
                        : "Not for sale"}
                    </p>
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                    <div>
                      Collection: {project.collectionAddress.slice(0, 6)}...
                      {project.collectionAddress.slice(-4)}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between text-sm text-gray-500">
                <span>Chain: {project.chainId}</span>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
