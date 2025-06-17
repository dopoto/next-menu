import { v } from "convex/values";
import { mutation } from "./_generated/server";

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
