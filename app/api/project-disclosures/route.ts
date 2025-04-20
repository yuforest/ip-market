import { and, eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../lib/db"
import { projectDisclosures } from "../../../lib/db/schema"

// プロジェクト開示情報作成API
export async function POST(req: NextRequest) {
  try {
    const { projectId, disclosureType, title, description } = await req.json()

    // 必須項目のバリデーション
    if (!projectId || !disclosureType || !title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // プロジェクト開示情報を作成
    const [disclosure] = await db
      .insert(projectDisclosures)
      .values({
        projectId,
        disclosureType,
        title,
        description,
      })
      .returning()

    return NextResponse.json(disclosure)
  } catch (error: any) {
    console.error("Failed to create project disclosure:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// プロジェクト開示情報一覧取得API
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const projectId = url.searchParams.get("projectId")
    const disclosureType = url.searchParams.get("disclosureType")

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    // クエリ条件を構築
    const conditions = [eq(projectDisclosures.projectId, projectId)]

    if (disclosureType) {
      conditions.push(eq(projectDisclosures.disclosureType, disclosureType))
    }

    // プロジェクト開示情報一覧を取得
    const disclosures = await db.query.projectDisclosures.findMany({
      where: and(...conditions),
      orderBy: (disclosures, { desc }) => [desc(disclosures.uploadedAt)],
    })

    return NextResponse.json(disclosures)
  } catch (error: any) {
    console.error("Failed to get project disclosures:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
