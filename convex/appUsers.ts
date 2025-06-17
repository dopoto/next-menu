import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createAppUser = mutation({
    args: {
        role: v.union(v.literal("orgowner"), v.literal("admin"), v.literal("user")),
        clerkUserId: v.string(),
        orgId: v.id("organizations"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("appUsers", {
            role: args.role,
            clerkUserId: args.clerkUserId,
            orgId: args.orgId,
            updatedAt: Date.now()
        });
    },
});
