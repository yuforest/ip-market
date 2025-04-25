import { and, eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { nftProjects } from "@/lib/db/schema"

// プロジェクト詳細取得API
export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const projectId = params.id

    // プロジェクト詳細を取得
    const project = await db.query.nftProjects.findFirst({
      where: and(eq(nftProjects.id, projectId), eq(nftProjects.status, "active")),
      with: {
        owner: true,
        listings: true,
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
  } catch (error: unknown) {
    console.error("Failed to get project:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}

// プロジェクト更新API
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id
    const body = await req.json()

    // 更新データのバリデーション
    const { name, description, category, status, royaltyPct, ltmRevenueUSD, metadataCID } = body

    // プロジェクトの存在確認
    const existingProject = await db.query.nftProjects.findFirst({
      where: eq(nftProjects.id, projectId),
    })

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // プロジェクト更新
    const updatedProject = await db
      .update(nftProjects)
      .set({
        ...(name && { name }),
        ...(description && { description }),
        ...(category && { category }),
        ...(status && { status }),
        ...(royaltyPct !== undefined && { royaltyPct }),
        ...(ltmRevenueUSD !== undefined && { ltmRevenueUSD }),
        ...(metadataCID && { metadataCID }),
        updatedAt: new Date(),
      })
      .where(eq(nftProjects.id, projectId))
      .returning()

    return NextResponse.json(updatedProject[0])
  } catch (error: unknown) {
    console.error("Failed to update project:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
