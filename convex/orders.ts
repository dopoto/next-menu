import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { deliveryStatusValidator } from "./validators";

export const createOrder = mutation({
    args: {
        currencyId: v.string(), //TODO validator
        items: v.array(v.object({
            menuItemId: v.id("menuItems"), // Use correct Id type
            sortOrderIndex: v.optional(v.number())
        })),
    },
    handler: async (ctx, args) => {
        // Security checks
        const userId = await getAuthUserId(ctx);
        if (!userId) { throw new Error("Not authenticated") }

        const user = await ctx.db.get(userId);
        if (!user) { throw new Error("User not found") }

        const appUser = await ctx.db
            .query("appUsers")
            .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", user.email || "")) //TODO user email
            .unique();
        if (!appUser) { throw new Error("User not found in organization") }

        const location = await ctx.db
            .query("locations")
            .filter((q) => q.eq(q.field("orgId"), appUser.orgId))
            .unique();
        if (!location) { throw new Error(`Location not found for current user.`) }

        const orderId = await ctx.db.insert("orders", {
            locationId: location._id,
            updatedAt: Date.now()
        });

        await Promise.all(args.items.map((item) =>
            ctx.db.insert("orderItems", {
                orderId,
                menuItemId: item.menuItemId,
                currencyId: args.currencyId,
                deliveryStatus: 'pending', //TODO validate 
                isPaid: false,
                updatedAt: Date.now()
            })
        ));


        return orderId;
    },
});

export const getOrderByUserFriendlyId = query({
    args: {
        userFriendlyOrderId: v.string(),
    },
    handler: async (ctx, args) => {
        const order = await ctx.db
            .query("orders")
            .filter((q) => q.eq(q.field("userFriendlyId"), args.userFriendlyOrderId))
            .unique();
        if (!order) { return null }

        //TODO Security check 

        return order
    },
});

// TODO only as example
export const getOrdersExample = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("orders").collect();
    },
});