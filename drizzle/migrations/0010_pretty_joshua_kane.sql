ALTER TABLE "transactions" RENAME COLUMN "executed_at" TO "created_at";--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;