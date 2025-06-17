import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

//TODO
//     // Needed - performs security checks and throws on failure.
//     await getLocationForCurrentUserOrThrow(data.locationId);

export const createMenuItem = mutation({
    args: {
        locationId: v.id("locations"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        imageId: v.optional(v.string()),
        price: v.number(),
        type: v.optional(v.union(v.literal("dish"), v.literal("beverage"))),
        isNew: v.optional(v.boolean()),
        isPublished: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        //TODO security checks
        return await ctx.db.insert("menuItems", {
            locationId: args.locationId,
            name: args.name,
            description: args.description,
            imageId: args.imageId,
            price: args.price,
            type: args.type ?? "dish", // Default to "dish"
            isNew: args.isNew ?? false, // Default to false
            isPublished: args.isPublished ?? true,
            updatedAt: Date.now()
        });
    },
});

export const updateMenuItem = mutation({
    args: {
        menuItemId: v.id("menuItems"),
        name: v.optional(v.string()),
        price: v.optional(v.string()),
        description: v.optional(v.string()),
        imageId: v.optional(v.string()),
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
        const menuItem = await ctx.db.get(args.menuItemId);
        if (!menuItem) {
            throw new Error("Menu item not found");
        }

        // Get the menu's location to check organization
        const location = await ctx.db.get(menuItem.locationId);
        if (!location) {
            throw new Error("Menu item location not found");
        }

        // Verify the menu's location belongs to the user's organization
        if (location.orgId !== appUser.orgId) {
            throw new Error("Location not in your organization");
        }

        return await ctx.db.patch(args.menuItemId, {
            name: args.name,
            price: Number(args.price), // TODO
            description: args.description,
            imageId: args.imageId,
            updatedAt: Date.now()
        });

        return { success: true };
    },
});

export const deleteMenuItem = mutation({
    args: {
        menuItemId: v.id("menuItems"),
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

        // Verify the menu item exists
        const menuItem = await ctx.db.get(args.menuItemId);
        if (!menuItem) {
            throw new Error("Menu item not found");
        }

        // Get the menu's location to check organization
        const location = await ctx.db.get(menuItem.locationId);
        if (!location) {
            throw new Error("Menu item location not found");
        }

        // Verify the menu's location belongs to the user's organization
        if (location.orgId !== appUser.orgId) {
            throw new Error("Menu not in your organization");
        }

        // Delete all menu item associations first
        const menuItemAssociations = await ctx.db
            .query("menuItemsToMenus")
            .withIndex("by_menu_item_id", (q) => q.eq("menuItemId", args.menuItemId))
            .collect();

        // Delete each association
        for (const association of menuItemAssociations) {
            await ctx.db.delete(association._id);
        }

        // Finally, delete the menu itself
        await ctx.db.delete(args.menuItemId);

        return { success: true };
    },
});
