"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectForm } from "@/components/project-form";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { ProjectStatus } from "@/lib/db/enums";

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/user/projects/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setInitialData(data);
        } else {
          console.error("Failed to fetch project");
          router.push("/user/dashboard");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        router.push("/user/dashboard");
      }
    };

    fetchProject();
  }, [params.id, router]);

  const handleSubmit = async (formData: any) => {
    try {
      const response = await fetch(`/api/user/projects/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/user/projects");
      } else {
        console.error("Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/user/projects/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete project');

      toast.success('Project deleted successfully');
      router.push('/user/dashboard');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleVisibilityToggle = async () => {
    if (!initialData) return;

    const newStatus = initialData.status === ProjectStatus.ACTIVE
      ? ProjectStatus.DRAFT
      : ProjectStatus.ACTIVE;

    try {
      const response = await fetch(`/api/user/projects/${params.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setInitialData({ ...initialData, status: newStatus });
        toast.success(`Project ${newStatus === ProjectStatus.ACTIVE ? 'published' : 'unpublished'} successfully`);
      } else {
        throw new Error('Failed to update project status');
      }
    } catch (error) {
      console.error('Error updating project status:', error);
      toast.error('Failed to update project status');
    }
  };

  if (!initialData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Edit Project</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={initialData.status === ProjectStatus.ACTIVE}
              onCheckedChange={handleVisibilityToggle}
            />
            <span className="text-sm">
              {initialData.status === ProjectStatus.ACTIVE ? 'Published' : 'Draft'}
            </span>
          </div>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash className="h-4 w-4" />
            Delete Project
          </Button>
        </div>
      </div>
      <ProjectForm initialData={initialData} onSubmit={handleSubmit} isEditing />
    </div>
  );
}
