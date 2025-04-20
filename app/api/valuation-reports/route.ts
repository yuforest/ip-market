import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../lib/db"
import { valuationReports } from "../../../lib/db/schema"

// 評価レポート作成API
export async function POST(req: NextRequest) {
  try {
    const {
      nftProjectId,
      estimatedValueUsd,
      modelVersion,
      commentaryText,
    } = await req.json()

    if (!nftProjectId || !estimatedValueUsd || !modelVersion) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      )
    }

    const [report] = await db
      .insert(valuationReports)
      .values({
        nftProjectId,
        estimatedValueUsd,
        modelVersion,
        commentaryText,
      })
      .returning()

    return NextResponse.json(report)
  } catch (error: any) {
    console.error("Failed to create valuation report:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// 評価レポート取得API
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const reportId = url.searchParams.get("reportId")
    const nftProjectId = url.searchParams.get("nftProjectId")

    if (!reportId && !nftProjectId) {
      return NextResponse.json(
        { error: "Either reportId or nftProjectId is required" },
        { status: 400 }
      )
    }

    let report

    if (reportId) {
      report = await db.query.valuationReports.findFirst({
        where: eq(valuationReports.id, reportId),
      })
    } else if (nftProjectId) {
      report = await db.query.valuationReports.findMany({
        where: eq(valuationReports.nftProjectId, nftProjectId),
      })
    }

    if (!report) {
      return NextResponse.json({ error: "Valuation report not found" }, { status: 404 })
    }

    return NextResponse.json(report)
  } catch (error: any) {
    console.error("Failed to get valuation report:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
