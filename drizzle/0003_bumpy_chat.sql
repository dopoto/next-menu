DROP INDEX "location_name_idx";--> statement-breakpoint
DROP INDEX "menu_item_name_idx";--> statement-breakpoint
DROP INDEX "menu_name_idx";--> statement-breakpoint
ALTER TABLE "next-menu_menu_item" ADD COLUMN "type" varchar(10) DEFAULT 'dish' NOT NULL;