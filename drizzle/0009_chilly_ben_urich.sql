ALTER TABLE "next-menu_order_item" ADD COLUMN "delivery_status" varchar(10) DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "next-menu_order_item" DROP COLUMN "is_delivered";