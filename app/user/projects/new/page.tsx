"use client";

import { useRouter } from "next/navigation";
import { ProjectForm } from "@/components/project-form";

export default function RegisterProjectPage() {
  const router = useRouter();

  const handleSubmit = async (formData: any) => {
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
