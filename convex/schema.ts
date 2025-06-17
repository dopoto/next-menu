import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
import { deliveryStatusValidator } from "./validators";

const applicationTables = {
  organizations: defineTable({
    clerkOrgId: v.string(),
    stripeCustomerId: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_clerk_org_id", ["clerkOrgId"]),

  appUsers: defineTable({
    role: v.union( // TODO validator
      v.literal("orgowner"),
      v.literal("admin"),
      v.literal("user")
    ),
    clerkUserId: v.string(),
    orgId: v.id("organizations"),
    updatedAt: v.number(),
  })
    .index("by_clerk_user_id", ["clerkUserId"])
    .index("by_org_id", ["orgId"])
    .index("by_updated_at", ["updatedAt"]),

  locations: defineTable({
    name: v.string(),
    slug: v.string(),
    currencyId: v.string(),// TODO validator
    orgId: v.id("organizations"),
    menuMode: v.string(), // TODO validator
    updatedAt: v.number(),
  })
    .index("by_name", ["name"])
    .index("by_slug", ["slug"])
    .index("by_updated_at", ["updatedAt"])
    .index("by_org_id", ["orgId"]),

  menus: defineTable({
    name: v.optional(v.string()),
    locationId: v.id("locations"),
    isPublished: v.boolean(),
    updatedAt: v.number(),
  })
    .index("by_name", ["name"])
    .index("by_location_id", ["locationId"])
    .index("by_updated_at", ["updatedAt"])
    .index("by_location_and_published", ["locationId", "isPublished"]),

  menuItems: defineTable({
    locationId: v.id("locations"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    imageId: v.optional(v.string()),
    price: v.number(),
    type: v.union(v.literal("dish"), v.literal("beverage")),
    isNew: v.boolean(),
    isPublished: v.boolean(),
    updatedAt: v.number(),
  })
    .index("by_name", ["name"])
    .index("by_location_id", ["locationId"])
    .index("by_location_and_published", ["locationId", "isPublished"])
    .index("by_updated_at", ["updatedAt"])
    .index("by_location_and_type", ["locationId", "type"]),

  menuItemsToMenus: defineTable({
    menuId: v.id("menus"),
    menuItemId: v.id("menuItems"),
    sortOrderIndex: v.number(),
    updatedAt: v.number(),
  })
    .index("by_menu_id", ["menuId"])
    .index("by_menu_item_id", ["menuItemId"])
    .index("by_updated_at", ["updatedAt"])
    .index("by_menu_and_sort_order", ["menuId", "sortOrderIndex"]),

  orders: defineTable({
    locationId: v.id("locations"),
    updatedAt: v.number(),
  })
    .index("by_location_id", ["locationId"]),

  orderItems: defineTable({
    orderId: v.id("orders"),
    menuItemId: v.id("menuItems"),
    currencyId: v.string(),// TODO validator
    deliveryStatus: deliveryStatusValidator,
    isPaid: v.boolean(),
    updatedAt: v.number(),
  })
    .index("by_order_id", ["orderId"])
    .index("by_menu_item_id", ["menuItemId"])
    .index("by_delivery_status", ["deliveryStatus"])
    .index("by_updated_at", ["updatedAt"])
    .index("by_order_and_status", ["orderId", "deliveryStatus"]),

  //TODO Implement full audit logs
  // auditLogs: defineTable({
  //   tableName: v.string(),
  //   recordId: v.string(),
  //   action: v.union(v.literal("create"), v.literal("update"), v.literal("delete")),
  //   changes: v.optional(v.any()), // Store what changed
  //   userId: v.optional(v.id("users")),
  // })
  //   .index("by_table_and_record", ["tableName", "recordId"])
  //   .index("by_user", ["userId"]);
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
