import { auth } from "@/auth";
import { ProjectList } from "@/components/user/project-list";
import { db } from "@/lib/db";
import { ProjectStatus } from "@/lib/db/enums";
import { listings, nftProjects, transactions, users } from "@/lib/db/schema";
import { and, eq, ne } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });
  if (!user) {
    redirect("/login");
  }
  // 自分が購入したプロジェクトを取得
  const purchasedProjects = await db.select({
    id: nftProjects.id,
    name: nftProjects.name,
    metadataCID: nftProjects.metadataCID,
    category: nftProjects.category,
    priceUSDC: listings.priceUSDC,
    transaction: {
      createdAt: transactions.createdAt,
      priceUSDC: transactions.priceUSDC,
    }
  }).from(nftProjects)
   .innerJoin(listings, eq(nftProjects.id, listings.projectId))
   .innerJoin(transactions, eq(listings.id, transactions.listingId)).where(and(
      eq(nftProjects.status, ProjectStatus.SOLD),
      eq(transactions.userId, user.id)
    ))
  console.log(purchasedProjects);

  const projects = await db.query.nftProjects.findMany({
    where: and(
      eq(nftProjects.ownerId, session.user.id),
      ne(nftProjects.status, ProjectStatus.DELETED)
    ),
    with: {
      owner: true,
      valuationReports: {
        orderBy: (reports, { desc }) => [desc(reports.createdAt)],
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
                  src={project.metadataCID || "https://placeholder.pics/svg/500"}
                  alt={project.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">{project.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                  <span>Category: {project.category}</span>
                  <span>Purchased: {project.transaction?.createdAt.toLocaleString()}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-rose-500">{project.transaction?.priceUSDC}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
