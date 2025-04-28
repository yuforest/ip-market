import Link from "next/link";
import { Listing, NftProject, nftProjects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { ProjectStatus } from "@/lib/db/enums";
import ProjectCard from "./projects/project-card";

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
            <ProjectCard key={project.id} project={project as NftProject & { listing: Listing }} />
          ))}
        </div>
      </div>
    </section>
  );
}
