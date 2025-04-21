ALTER TABLE "users" RENAME COLUMN "did" TO "sub";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_did_unique";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_sub_unique" UNIQUE("sub");