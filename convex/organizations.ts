import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createOrganization = mutation({
    args: {
        clerkOrgId: v.string(),
        stripeCustomerId: v.string()
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("organizations", {
            clerkOrgId: args.clerkOrgId,
            stripeCustomerId: args.stripeCustomerId,
            updatedAt: Date.now()
        });
    },
});

export const updateOrganization = mutation({
    args: {
        organizationId: v.id("organizations"),
        clerkOrgId: v.string(),
        stripeCustomerId: v.string()
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.organizationId, {
            clerkOrgId: args.clerkOrgId,
            stripeCustomerId: args.stripeCustomerId,
            updatedAt: Date.now(),
        });
    },
});
