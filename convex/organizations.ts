import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const provisionOrganization = mutation({
    args: {
        clerkUserId: v.string(),
        orgId: v.string(),
        currencyId: v.string(),
        stripeCustomerId: v.optional(v.string()),
        locationName: v.string(),
        locationSlug: v.string(),
        menuMode: v.string(), //TODO
    },
    handler: async (ctx, args) => {
        const orgId = await ctx.db.insert("organizations", {
            clerkOrgId: args.orgId,
            stripeCustomerId: args.stripeCustomerId,
            updatedAt: Date.now()
        });

        const userId = await ctx.db.insert("appUsers", {
            clerkUserId: args.clerkUserId,
            role: 'orgowner', //TODO review
            orgId,
            updatedAt: Date.now(),
        });

        const locationId = await ctx.db.insert("locations", {
            name: args.locationName,
            slug: args.locationSlug,
            orgId,
            menuMode: args.menuMode ?? "noninteractive",
            currencyId: args.currencyId,
            updatedAt: Date.now()
        });

        return { orgId, userId, locationId };
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
