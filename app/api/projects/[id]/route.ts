import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../../lib/db"
import { listings, nftProjects } from "../../../../lib/db/schema"

// プロジェクト詳細取得API
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id

    // プロジェクト詳細を取得
    const project = await db.query.nftProjects.findFirst({
      where: eq(nftProjects.id, projectId),
      with: {
        owner: {
          with: {
            wallets: true,
          },
        },
        listings: {
          where: eq(listings.status, "active"),
          with: {
            sellerWallet: true,
          },
        },
        valuationReports: {
          orderBy: (reports, { desc }) => [desc(reports.generatedAt)],
          limit: 1,
        },
        disclosures: true,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error: any) {
    console.error("Failed to get project:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
