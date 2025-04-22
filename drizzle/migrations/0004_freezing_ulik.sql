ALTER TABLE "project_disclosures" RENAME COLUMN "uploaded_at" TO "created_at";--> statement-breakpoint
ALTER TABLE "project_disclosures" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;