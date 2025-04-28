import ProjectCard from "@/components/projects/project-card";
import { SearchForm } from "@/components/projects/search-form";
import { Listing, NftProject } from "@/lib/db/schema";

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

type Project = NftProject & {
  listing: Listing;
};

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const { search, category } = await searchParams;

  const res = await getProjects({ search, category });
  const projects = res.projects as Project[];
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
            <ProjectCard key={project.id} project={project} />
          ))}
          {projects.length === 0 && (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">
                現在、アクティブなプロジェクトはありません。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
