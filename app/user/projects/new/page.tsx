"use client";

import type { ProjectFormData } from "@/components/project-form";
import { ProjectForm } from "@/components/project-form";
import { useRouter } from "next/navigation";

export default function RegisterProjectPage() {
  const router = useRouter();

  const handleSubmit = async (formData: ProjectFormData) => {
    try {
      const response = await fetch("/api/user/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/user/dashboard");
      } else {
        console.error("Failed to create project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return <ProjectForm onSubmit={handleSubmit} />;
}
