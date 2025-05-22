ALTER TABLE "next-menu_order_item" ADD COLUMN "menu_item_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "next-menu_order_item" ADD COLUMN "is_delivered" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "next-menu_order_item" ADD COLUMN "is_paid" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "next-menu_order_item" ADD CONSTRAINT "next-menu_order_item_menu_item_id_next-menu_menu_item_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."next-menu_menu_item"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "next-menu_order_item" DROP COLUMN "status";