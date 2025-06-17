import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Creates a menu and associates menu items with it.
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

export const getMenu = query({
    args: {
        menuId: v.id("menus"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return null;
        }

        return await ctx.db.get(args.menuId);
    },
});

export const listMenus = query({
    args: {
        locationId: v.id("locations"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return [];
        }

        return await ctx.db
            .query("menus")
            .withIndex("by_location_id", (q) => q.eq("locationId", args.locationId))
            .collect();
    },
});

export const deleteMenu = mutation({
    args: {
        menuId: v.id("menus"),
    },
    handler: async (ctx, args) => {
        // Check if user is authenticated
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        // Get user's organization from appUsers table
        const user = await ctx.db.get(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const appUser = await ctx.db
            .query("appUsers")
            .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", user.email || ""))
            .unique();

        if (!appUser) {
            throw new Error("User not found in organization");
        }

        // Verify the menu exists
        const menu = await ctx.db.get(args.menuId);
        if (!menu) {
            throw new Error("Menu not found");
        }

        // Get the menu's location to check organization
        const location = await ctx.db.get(menu.locationId);
        if (!location) {
            throw new Error("Menu location not found");
        }

        // Verify the menu's location belongs to the user's organization
        if (location.orgId !== appUser.orgId) {
            throw new Error("Menu not in your organization");
        }

        // Delete all menu item associations first
        const menuItemAssociations = await ctx.db
            .query("menuItemsToMenus")
            .withIndex("by_menu_id", (q) => q.eq("menuId", args.menuId))
            .collect();

        // Delete each association
        for (const association of menuItemAssociations) {
            await ctx.db.delete(association._id);
        }

        // Finally, delete the menu itself
        await ctx.db.delete(args.menuId);

        return { success: true };
    },
});

