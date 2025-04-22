import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit } from "lucide-react"
import { ProjectStatus } from "@/lib/db/enums"
import type { NftProject } from "@/lib/db/schema"

interface ProjectListProps {
  projects: NftProject[]
}

export async function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 flex flex-col items-center justify-center text-center">
          <p className="text-muted-foreground mb-4">
            You haven't registered any projects yet
          </p>
          <Button asChild className="bg-rose-500 hover:bg-rose-600">
            <Link href="/user/projects/new">Register a Project</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{project.name}</h3>
                  <Badge
                    variant={
                      project.status === ProjectStatus.ACTIVE
                        ? "default"
                        : "outline"
                    }
                  >
                    {project.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                  <span>Category: {project.category}</span>
                  <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/projects/${project.id}`} target="_blank">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/user/projects/${project.id}/edit`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}