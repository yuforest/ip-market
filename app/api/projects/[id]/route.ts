import { db } from "@/lib/db";
import { nftProjects } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

// Get project details API
export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const projectId = params.id

    // Get project details
    const project = await db.query.nftProjects.findFirst({
      where: and(eq(nftProjects.id, projectId)),
      with: {
        owner: true,
        listing: true,
        valuationReports: {
          orderBy: (reports, { desc }) => [desc(reports.createdAt)],
          limit: 1,
        },
        disclosures: true,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error: unknown) {
    console.error("Failed to get project:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
