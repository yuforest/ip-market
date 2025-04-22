ALTER TABLE "nft_projects" ADD COLUMN "status" text DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "nft_projects" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;