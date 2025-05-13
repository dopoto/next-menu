ALTER TABLE "next-menu_location" ADD COLUMN "currency_id" varchar(3) DEFAULT 'USD' NOT NULL;--> statement-breakpoint
ALTER TABLE "next-menu_location" ADD COLUMN "menu_mode" varchar(20) DEFAULT 'noninteractive' NOT NULL;--> statement-breakpoint
ALTER TABLE "next-menu_menu" DROP COLUMN "currency_id";