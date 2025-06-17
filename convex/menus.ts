import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createMenu = mutation({
    args: {
        name: v.optional(v.string()),
        locationId: v.id("locations"),
        isPublished: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("menus", {
            name: args.name,
            locationId: args.locationId,
            isPublished: args.isPublished ?? true,
            updatedAt: Date.now()
        });
    },
});
