import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { nftProjects } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/auth"
import { ProjectStatus } from "@/lib/db/enums"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { status } = await request.json()

    if (!Object.values(ProjectStatus).includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const [project] = await db
      .select()
      .from(nftProjects)
      .where(eq(nftProjects.id, params.id))

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await db
      .update(nftProjects)
      .set({ status })
      .where(eq(nftProjects.id, params.id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating project status:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}