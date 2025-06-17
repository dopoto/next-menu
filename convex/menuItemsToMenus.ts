import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const addItemToMenu = mutation({
    args: {
        menuId: v.id("menus"),
        menuItemId: v.id("menuItems"),
        sortOrderIndex: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        // Check if relationship already exists
        const existing = await ctx.db
            .query("menuItemsToMenus")
            .withIndex("by_menu_id", (q) => q.eq("menuId", args.menuId))
            .filter((q) => q.eq(q.field("menuItemId"), args.menuItemId))
            .unique();

        if (existing) {
            throw new Error("Menu item already exists in this menu");
        }

        return await ctx.db.insert("menuItemsToMenus", {
            menuId: args.menuId,
            menuItemId: args.menuItemId,
            sortOrderIndex: args.sortOrderIndex ?? 0,
            updatedAt: Date.now()
        });
    },
});
