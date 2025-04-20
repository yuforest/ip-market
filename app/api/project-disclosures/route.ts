import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../lib/db"
import { projectDisclosures } from "../../../lib/db/schema"

// プロジェクト開示情報作成API
export async function POST(req: NextRequest) {
  try {
    const {
      projectId,
      disclosureType,
      title,
      description,
    } = await req.json()

    if (!projectId || !disclosureType || !title) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      )
    }

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

// プロジェクト開示情報取得API
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const disclosureId = url.searchParams.get("disclosureId")
    const projectId = url.searchParams.get("projectId")

    if (!disclosureId && !projectId) {
      return NextResponse.json(
        { error: "Either disclosureId or projectId is required" },
        { status: 400 }
      )
    }

    let disclosure

    if (disclosureId) {
      disclosure = await db.query.projectDisclosures.findFirst({
        where: eq(projectDisclosures.id, disclosureId),
      })
    } else if (projectId) {
      disclosure = await db.query.projectDisclosures.findMany({
        where: eq(projectDisclosures.projectId, projectId),
      })
    }

    if (!disclosure) {
      return NextResponse.json({ error: "Project disclosure not found" }, { status: 404 })
    }

    return NextResponse.json(disclosure)
  } catch (error: any) {
    console.error("Failed to get project disclosure:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
