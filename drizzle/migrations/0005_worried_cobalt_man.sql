ALTER TABLE "listings" DROP CONSTRAINT "listings_seller_wallet_id_wallets_id_fk";
--> statement-breakpoint
ALTER TABLE "listings" DROP COLUMN "seller_wallet_id";