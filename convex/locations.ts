import { v } from "convex/values";
import { mutation } from "./_generated/server";

// In your mutations, validate the currency
export const createLocation = mutation({
    args: {
        name: v.string(),
        slug: v.string(),
        orgId: v.id("organizations"),
        currencyId: v.string(),
        menuMode: v.string(),
    },
    handler: async (ctx, args) => {
        // Validate currency in the handler
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