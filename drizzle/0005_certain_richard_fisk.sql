ALTER TABLE "next-menu_menu_item" ADD COLUMN "is_published" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "next-menu_menu" ADD COLUMN "currency_id" varchar(3) DEFAULT 'USD' NOT NULL;--> statement-breakpoint
ALTER TABLE "next-menu_menu" ADD COLUMN "is_published" boolean DEFAULT true NOT NULL;