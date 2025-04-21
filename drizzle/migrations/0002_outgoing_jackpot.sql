ALTER TABLE "wallets" RENAME COLUMN "chain_id" TO "chain";--> statement-breakpoint
ALTER TABLE "wallets" RENAME COLUMN "linked_at" TO "created_at";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "wallets" ADD COLUMN "dynamic_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "wallets" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "wallets" DROP COLUMN "is_primary";--> statement-breakpoint
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_dynamic_id_unique" UNIQUE("dynamic_id");