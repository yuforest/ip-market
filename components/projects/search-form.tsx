"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProjectCategory } from "@/lib/db/enums";

interface SearchFormProps {
  initialSearch?: string;
  initialCategory?: string;
}

const CATEGORIES = Object.values(ProjectCategory);

export function SearchForm({ initialSearch, initialCategory }: SearchFormProps) {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<ProjectCategory[]>(
    initialCategory ? [initialCategory as ProjectCategory] : []
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    
    if (formData.get('search')) {
      params.set('search', formData.get('search') as string);
    }
    if (selectedCategories.length > 0) {
      params.set('category', selectedCategories.join(','));
    }

    router.push(`?${params.toString()}`);
  };

  const handleCategoryChange = (category: ProjectCategory, checked: boolean) => {
    setSelectedCategories(prev => {
      if (checked) {
        return [...prev, category];
      } else {
        return prev.filter(c => c !== category);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by project name, category..."
            className="w-full pl-8"
            name="search"
            defaultValue={initialSearch}
          />
        </div>
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Categories</h3>
        <div className="flex flex-wrap gap-4">
          {CATEGORIES.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
              />
              <Label htmlFor={`category-${category}`}>{category}</Label>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
} 