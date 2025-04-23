import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SearchForm } from "@/components/projects/search-form";
import { NftProject } from "@/lib/db/schema";

export async function getProjects(params: {
  search?: string;
  category?: string;
  ownerId?: string;
  limit?: number;
  offset?: number;
}) {
  const queryParams = new URLSearchParams();

  if (params.search) queryParams.set("search", params.search);
  if (params.category) queryParams.set("category", params.category);
  if (params.ownerId) queryParams.set("ownerId", params.ownerId);
  if (params.limit) queryParams.set("limit", params.limit.toString());
  if (params.offset) queryParams.set("offset", params.offset.toString());

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/projects?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get projects: ${response.statusText}`);
  }

  return response.json();
}

interface ProjectsPageProps {
  searchParams: {
    search?: string;
    category?: string;
  };
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { search, category } = searchParams;

  const res = await getProjects({ search, category });
  const projects = res.projects as NftProject[];

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground">Discover NFT IP Collections</p>
        </div>

        <SearchForm initialSearch={search} initialCategory={category} />

        {/* Projects List */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link href={`/projects/${project.id}`} key={project.id}>
              <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={"https://placehold.co/600x400"}
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
                        {/* {project.price} */}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between text-sm text-gray-500">
                  {/* <span>Holders: {project.holders}</span>
                    <span>Volume: {project.volume}</span> */}
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
