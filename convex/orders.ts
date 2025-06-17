import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("orders").collect();
    },
});

export const createOrder = mutation({
    args: {
        locationId: v.id("locations"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("orders", {
            locationId: args.locationId,
        });
    },
});