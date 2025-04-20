import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../lib/db"
import { valuationReports } from "../../../lib/db/schema"

// 価値評価レポート作成API
export async function POST(req: NextRequest) {
  try {
    const { projectId, estimatedValueUSD, agentId, modelVersion, featuresJSON, commentaryText } = await req.json()

    // 必須項目のバリデーション
    if (!projectId || !estimatedValueUSD || !agentId || !modelVersion || !featuresJSON || !commentaryText) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 価値評価レポートを作成
    const [report] = await db
      .insert(valuationReports)
      .values({
        projectId,
        estimatedValueUSD,
        agentId,
        modelVersion,
        featuresJSON,
        commentaryText,
      })
      .returning()

    return NextResponse.json(report)
  } catch (error: any) {
    console.error("Failed to create valuation report:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// プロジェクトの最新価値評価レポート取得API
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const projectId = url.searchParams.get("projectId")

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    // プロジェクトの最新価値評価レポートを取得
    const report = await db.query.valuationReports.findFirst({
      where: eq(valuationReports.projectId, projectId),
      orderBy: (reports, { desc }) => [desc(reports.generatedAt)],
    })

    if (!report) {
      return NextResponse.json({ error: "No valuation report found for this project" }, { status: 404 })
    }

    return NextResponse.json(report)
  } catch (error: any) {
    console.error("Failed to get valuation report:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
