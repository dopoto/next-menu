import { v } from "convex/values";
import { mutation } from "./_generated/server";

/**
 * Creates a menu and associates menu items with it
 */
export const createMenu = mutation({
    args: {
        name: v.optional(v.string()),
        locationId: v.number(),  // Accept numeric ID from Drizzle
        isPublished: v.optional(v.boolean()),
        items: v.optional(v.array(v.object({
            id: v.number(),  // Accept numeric ID from Drizzle
            sortOrderIndex: v.optional(v.number())
        }))),
    },
    handler: async (ctx, args) => {
        // Convert numeric locationId to Convex ID format
        const location = await ctx.db
            .query("locations")
            .filter((q) => q.eq(q.field("_id"), args.locationId.toString()))
            .unique();

        if (!location) {
            throw new Error(`Location ${args.locationId} not found`);
        }

        // Create the menu first
        const menuId = await ctx.db.insert("menus", {
            name: args.name,
            locationId: location._id,
            isPublished: args.isPublished ?? true,
            updatedAt: Date.now()
        });

        // If items were provided, look up each menu item and create the associations
        if (args.items && args.items.length > 0) {
            const menuItems = await Promise.all(
                args.items.map(item =>
                    ctx.db
                        .query("menuItems")
                        .filter((q) => q.eq(q.field("_id"), item.id.toString()))
                        .unique()
                )
            );

            // Filter out any items that weren't found
            const validMenuItems = args.items.filter((_, i) => menuItems[i]);

            // Create the menu item associations
            await Promise.all(validMenuItems.map((item, index) =>
                ctx.db.insert("menuItemsToMenus", {
                    menuId,
                    menuItemId: menuItems[index]!._id,
                    sortOrderIndex: item.sortOrderIndex ?? index,
                    updatedAt: Date.now()
                })
            ));
        }

        return menuId;
    },
});
