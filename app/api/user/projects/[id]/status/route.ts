import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { nftProjects } from "@/lib/db/schema"
import { and, eq, or } from "drizzle-orm"
import { auth } from "@/auth"
import { ProjectStatus } from "@/lib/db/enums"

export async function PUT(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { status, projectId } = await request.json()

    if (!Object.values(ProjectStatus).includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const [project] = await db
      .select()
      .from(nftProjects)
      .where(and(eq(nftProjects.id, projectId), or(eq(nftProjects.status, ProjectStatus.ACTIVE), eq(nftProjects.status, ProjectStatus.DRAFT), eq(nftProjects.status, ProjectStatus.SUSPENDED))))

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await db
      .update(nftProjects)
      .set({ status })
      .where(eq(nftProjects.id, projectId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating project status:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}