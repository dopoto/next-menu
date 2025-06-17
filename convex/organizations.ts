import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

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

export const getOrganization = query({
    args: {
        clerkOrgId: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) { return null }

        const org = await ctx.db
            .query("organizations")
            .withIndex("by_clerk_org_id", (q) => q.eq("clerkOrgId", args.clerkOrgId))
            .unique();
        if (!org) { return null }

        const userInOrg = await ctx.db
            .query("appUsers")
            .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", userId))
            .unique();

        if (!userInOrg || userInOrg.orgId !== org._id) {
            return null;
        }

        return org;
    },
});
