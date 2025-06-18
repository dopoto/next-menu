import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createLocation = mutation({
    args: {
        name: v.string(),
        slug: v.string(),
        orgId: v.id("organizations"),
        currencyId: v.string(),
        menuMode: v.string(),
    },
    handler: async (ctx, args) => {
        // Validate currency in the handler TODO
        const validCurrencies = ['USD', 'CAD', 'EUR', /* ... your 100+ currencies */];
        if (!validCurrencies.includes(args.currencyId)) {
            throw new Error(`Invalid currency: ${args.currencyId}`);
        }

        return await ctx.db.insert("locations", {
            name: args.name,
            slug: args.slug,
            orgId: args.orgId,
            currencyId: args.currencyId,
            menuMode: args.menuMode ?? "noninteractive",
            updatedAt: Date.now()
        });
    },
});

export const updateLocation = mutation({
    args: {
        locationId: v.id("locations"),
        currencyId: v.string(),
        menuMode: v.string(),
        name: v.string(),
    },
    handler: async (ctx, args) => {
        // Validate currency in the handler

        // TODO 

        // const validCurrencies = ['USD', 'CAD', 'EUR', /* ... your 100+ currencies */];
        // if (!validCurrencies.includes(args.currencyId)) {
        //     throw new Error(`Invalid currency: ${args.currencyId}`);
        // }

        //TODO Security checks

        return await ctx.db.patch(args.locationId, {
            currencyId: args.currencyId,
            menuMode: args.menuMode,
            name: args.name,
            updatedAt: Date.now()
        });
    },
});

export const getLocationBySlug = query({
    args: {
        slug: v.string(),
    },
    handler: async (ctx, args) => {
        const locations = await ctx.db
            .query("locations")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .collect();
        return locations[0] ?? null;
    },
});

// TODO

export const getLocationForCurrentUserOrThrow = query({
    args: {
        locationId: v.number()
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) { throw new Error("Not authenticated") }

        const user = await ctx.db.get(userId);
        if (!user) { throw new Error("User not found") }

        const appUser = await ctx.db
            .query("appUsers")
            .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", user.email || ""))
            .unique();
        if (!appUser) { throw new Error("User not found in organization") }

        const location = await ctx.db
            .query("locations")
            .filter((q) => q.eq(q.field("orgId"), appUser.orgId))
            .unique();
        if (!location) { throw new Error(`Location not found for current user.`) }

        return location;
    },
});
