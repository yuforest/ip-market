CREATE TABLE "listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"seller_wallet_id" uuid NOT NULL,
	"status" text NOT NULL,
	"price_usdc" double precision NOT NULL,
	"escrow_address" text,
	"listed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nft_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"collection_address" text NOT NULL,
	"chain_id" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"royalty_pct" double precision,
	"ltm_revenue_usd" double precision,
	"owner_id" uuid,
	"metadata_cid" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_disclosures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"disclosure_type" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"listing_id" uuid NOT NULL,
	"buyer_wallet_id" uuid NOT NULL,
	"price_usdc" double precision NOT NULL,
	"executed_at" timestamp DEFAULT now() NOT NULL,
	"tx_hash" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"did" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_did_unique" UNIQUE("did")
);
--> statement-breakpoint
CREATE TABLE "valuation_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"estimated_value_usd" double precision NOT NULL,
	"agent_id" text NOT NULL,
	"model_version" text NOT NULL,
	"features_json" text NOT NULL,
	"commentary_text" text NOT NULL,
	"generated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wallets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"address" text NOT NULL,
	"chain_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"linked_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_project_id_nft_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."nft_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_seller_wallet_id_wallets_id_fk" FOREIGN KEY ("seller_wallet_id") REFERENCES "public"."wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nft_projects" ADD CONSTRAINT "nft_projects_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_disclosures" ADD CONSTRAINT "project_disclosures_project_id_nft_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."nft_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_buyer_wallet_id_wallets_id_fk" FOREIGN KEY ("buyer_wallet_id") REFERENCES "public"."wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "valuation_reports" ADD CONSTRAINT "valuation_reports_project_id_nft_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."nft_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;