CREATE TYPE "public"."disclosure_type" AS ENUM('financial', 'license', 'team', 'tokenomics');--> statement-breakpoint
CREATE TYPE "public"."listing_status" AS ENUM('draft', 'active', 'processing', 'sold', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."project_category" AS ENUM('Art', 'PFP', 'Game', 'Music', 'Utility');--> statement-breakpoint
CREATE TABLE "listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nft_project_id" uuid NOT NULL,
	"seller_wallet_address" text NOT NULL,
	"status" "listing_status" NOT NULL,
	"price_usdc" numeric NOT NULL,
	"escrow_address" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nft_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"collection_address" text NOT NULL,
	"chain_id" text NOT NULL,
	"description" text,
	"category" "project_category" NOT NULL,
	"royalty_pct" numeric DEFAULT '0' NOT NULL,
	"ltm_revenue_usd" numeric DEFAULT '0' NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_disclosures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"disclosure_type" "disclosure_type" NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"tx_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"listing_id" uuid NOT NULL,
	"buyer_wallet_address" text NOT NULL,
	"price_usdc" numeric NOT NULL,
	"executed_at" timestamp DEFAULT now() NOT NULL,
	"tx_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dynamic_user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_dynamic_user_id_unique" UNIQUE("dynamic_user_id")
);
--> statement-breakpoint
CREATE TABLE "valuation_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nft_project_id" uuid NOT NULL,
	"estimated_value_usd" numeric NOT NULL,
	"model_version" text NOT NULL,
	"commentary_text" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_nft_project_id_nft_projects_id_fk" FOREIGN KEY ("nft_project_id") REFERENCES "public"."nft_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nft_projects" ADD CONSTRAINT "nft_projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_disclosures" ADD CONSTRAINT "project_disclosures_project_id_nft_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."nft_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "valuation_reports" ADD CONSTRAINT "valuation_reports_nft_project_id_nft_projects_id_fk" FOREIGN KEY ("nft_project_id") REFERENCES "public"."nft_projects"("id") ON DELETE no action ON UPDATE no action;