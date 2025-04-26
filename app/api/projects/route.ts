import { and, eq, like, or, sql } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { nftProjects } from "@/lib/db/schema"
import { ProjectStatus } from "@/lib/db/enums"

// プロジェクト一覧取得API
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const search = url.searchParams.get("search") || ""
    const category = url.searchParams.get("category")
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")

    // クエリ条件を構築
    const conditions = []

    if (search) {
      conditions.push(or(like(nftProjects.name, `%${search}%`), like(nftProjects.description, `%${search}%`)))
    }

    if (category) {
      const categories = category.split(",").filter(Boolean)
      if (categories.length === 1) {
        conditions.push(eq(nftProjects.category, categories[0] as any))
      } else if (categories.length > 1) {
        const categoryConditions = categories.map(cat => eq(nftProjects.category, cat as any))
        conditions.push(or(...categoryConditions))
      }
    }

    conditions.push(eq(nftProjects.status, ProjectStatus.ACTIVE))

    // プロジェクト一覧を取得
    const projects = await db.query.nftProjects.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: {
        owner: true,
        valuationReports: {
          orderBy: (reports, { desc }) => [desc(reports.generatedAt)],
          limit: 1,
        },
        listing: true,
      },
      orderBy: (projects, { desc }) => [desc(projects.createdAt)],
      limit,
      offset,
    })

    // 総件数を取得
    const count = await db
      .select({ count: sql<number>`count(*)` })
      .from(nftProjects)
      .where(conditions.length > 0 ? and(...conditions) : undefined)

    return NextResponse.json({
      projects,
      count: count[0].count,
    })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    )
  }
}
