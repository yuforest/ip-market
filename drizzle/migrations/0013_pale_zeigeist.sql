ALTER TABLE "valuation_reports" RENAME COLUMN "generated_at" TO "created_at";--> statement-breakpoint
ALTER TABLE "valuation_reports" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "valuation_reports" DROP COLUMN "agent_id";--> statement-breakpoint
ALTER TABLE "valuation_reports" DROP COLUMN "features_json";