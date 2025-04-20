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

// プロジェクト更新API
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id
    const { name, description, category, royaltyPct, ltmRevenueUSD, metadataCID } = await req.json()

    // プロジェクトを更新
    const [updatedProject] = await db
      .update(nftProjects)
      .set({
        name,
        description,
        category,
        royaltyPct,
        ltmRevenueUSD,
        metadataCID,
      })
      .where(eq(nftProjects.id, projectId))
      .returning()

    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(updatedProject)
  } catch (error: any) {
    console.error("Failed to update project:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// プロジェクト削除API
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id

    // プロジェクトを削除
    const [deletedProject] = await db.delete(nftProjects).where(eq(nftProjects.id, projectId)).returning()

    if (!deletedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Failed to delete project:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
