"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectForm } from "@/components/project-form";

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
          router.push("/user/projects");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        router.push("/user/projects");
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

  if (!initialData) {
    return <div>Loading...</div>;
  }

  return <ProjectForm initialData={initialData} onSubmit={handleSubmit} isEditing />;
}
