import { auth } from "@/auth";
import { ProjectList } from "@/components/user/project-list";
import { db } from "@/lib/db";
import { ProjectStatus } from "@/lib/db/enums";
import { nftProjects } from "@/lib/db/schema";
import { and, eq, ne } from "drizzle-orm";
import { redirect } from "next/navigation";

// モックデータ
const purchasedProjects = [
  {
    id: "3",
    name: "Anime Avatars",
    image: "https://placeholder.pics/svg/500",
    purchaseDate: "August 10, 2023",
    price: "12,000 USDC",
    category: "Avatar",
  },
];

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const projects = await db.query.nftProjects.findMany({
    where: and(
      eq(nftProjects.ownerId, session.user.id),
      ne(nftProjects.status, ProjectStatus.DELETED)
    ),
    with: {
      owner: true,
      valuationReports: {
        orderBy: (reports, { desc }) => [desc(reports.generatedAt)],
        limit: 1,
      },
    },
    orderBy: (projects, { desc }) => [desc(projects.createdAt)],
  });

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-8">My Projects</h2>
      <ProjectList projects={projects} />

      <h2 className="text-2xl font-bold mt-12 mb-6">Purchase History</h2>
      <div className="space-y-4">
        {purchasedProjects.map((project) => (
          <div key={project.id} className="border rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={project.image}
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
                <div className="font-bold text-rose-500">{project.price}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
