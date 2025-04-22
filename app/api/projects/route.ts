import { and, eq, like, or } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../lib/db"
import { listings, nftProjects } from "../../../lib/db/schema"

// プロジェクト一覧取得API
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const search = url.searchParams.get("search") || ""
    const category = url.searchParams.get("category")
    const ownerId = url.searchParams.get("ownerId")
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")

    // クエリ条件を構築
    const conditions = []

    if (search) {
      conditions.push(or(like(nftProjects.name, `%${search}%`), like(nftProjects.description, `%${search}%`)))
    }

    if (category) {
      conditions.push(eq(nftProjects.category, category))
    }

    if (ownerId) {
      conditions.push(eq(nftProjects.ownerId, ownerId))
    }

    // プロジェクト一覧を取得
    const projects = await db.query.nftProjects.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: {
        owner: true,
        valuationReports: {
          orderBy: (reports, { desc }) => [desc(reports.generatedAt)],
          limit: 1,
        },
        listings: {
          where: eq(listings.status, "active"),
          limit: 1,
        },
      },
      limit,
      offset,
      orderBy: (projects, { desc }) => [desc(projects.createdAt)],
    })

    // 総件数を取得
    const [{ count }] = await db
      .select({ count: count() })
      .from(nftProjects)
      .where(conditions.length > 0 ? and(...conditions) : undefined)

    return NextResponse.json({
      projects,
      pagination: {
        total: Number(count),
        limit,
        offset,
      },
    })
  } catch (error: any) {
    console.error("Failed to get projects:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
