ALTER TABLE "nft_projects" RENAME COLUMN "user_id" TO "owner_id";--> statement-breakpoint
ALTER TABLE "nft_projects" DROP CONSTRAINT "nft_projects_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "nft_projects" ADD CONSTRAINT "nft_projects_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;