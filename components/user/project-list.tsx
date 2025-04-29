"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectStatus } from "@/lib/db/enums";
import type { NftProject, ValuationReport } from "@/lib/db/schema";
import { formatDate } from "@/lib/utils/date";
import { useSocialAccounts } from "@dynamic-labs/sdk-react-core";
import { ProviderEnum } from "@dynamic-labs/types";
import { Edit, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ProjectListProps {
  projects: (NftProject & { valuationReports: ValuationReport[] })[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const {
    linkSocialAccount,
    unlinkSocialAccount,
    isLinked,
    getLinkedAccountInformation,
  } = useSocialAccounts();

  const provider = ProviderEnum.Twitter;
  const isTwitterLinked = isLinked(provider);

  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();

  const generateValuation = async (projectId: string) => {
    try {
      setLoading((prev) => ({ ...prev, [projectId]: true }));
      const response = await fetch(
        `/api/user/projects/${projectId}/valuation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to generate valuation");
      }
      const data = await response.json();
      toast.success("Valuation report generated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to generate valuation report");
    } finally {
      setLoading((prev) => ({ ...prev, [projectId]: false }));
    }
  };

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
    );
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
                  {project.valuationReports.length > 0 && (
                    <Badge variant="outline">
                      Valuated on{" "}
                      {formatDate(project.valuationReports[0].createdAt)}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                  <span>Category: {project.category}</span>
                  <span>Created: {formatDate(project.createdAt)}</span>
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
                  {project.status !== ProjectStatus.SOLD &&
                    project.status !== ProjectStatus.DELETED && (
                      <>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/user/projects/${project.id}/edit`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <div>
                          {isTwitterLinked ? (
                            <Button
                              size="sm"
                              onClick={() => unlinkSocialAccount(provider)}
                            >
                              Disconnect
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => linkSocialAccount(provider)}
                            >
                              Connect
                            </Button>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => generateValuation(project.id)}
                          disabled={loading[project.id]}
                        >
                          {loading[project.id] ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : project.valuationReports.length > 0 ? (
                            "Update Valuation"
                          ) : (
                            "Generate Valuation"
                          )}
                        </Button>
                        {project.valuationReports.length > 0 && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/user/projects/${project.id}/listing`}>
                              <Edit className="h-4 w-4 mr-1" />
                              Listing
                            </Link>
                          </Button>
                        )}
                      </>
                    )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
