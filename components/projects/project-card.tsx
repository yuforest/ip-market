import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Listing, NftProject } from "@/lib/db/schema";
import Link from "next/link";

interface ProjectCardProps {
  project: NftProject & { listing: Listing };
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Link href={`/projects/${project.id}`} key={project.id}>
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="aspect-square relative overflow-hidden">
          <img
            src={project.image || "https://placehold.co/600x400"}
            alt={project.name}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">{project.name}</h3>
            </div>
            <div className="text-right">
              <p className="font-bold text-rose-500">
                {project.listing
                  ? `${project.listing.priceUSDC} USDC`
                  : "Not for sale"}
              </p>
            </div>
          </div>

          <div className="mt-2 flex justify-between text-sm text-muted-foreground">
            <div>
              Created: {new Date(project.createdAt).toLocaleDateString("ja-JP")}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between text-sm text-gray-500">
          <Badge variant="outline" className="mt-1">
            {project.category}
          </Badge>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProjectCard;
