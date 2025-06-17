import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { deliveryStatusValidator } from "./validators";

export const addOrderItem = mutation({
    args: {
        orderId: v.id("orders"),
        menuItemId: v.id("menuItems"),
        currencyId: v.string(), // TODO validator
        deliveryStatus: deliveryStatusValidator,
        isPaid: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("orderItems", {
            orderId: args.orderId,
            menuItemId: args.menuItemId,
            currencyId: args.currencyId,
            deliveryStatus: args.deliveryStatus ?? "pending", // Default to "pending"
            isPaid: args.isPaid ?? false,
            updatedAt: Date.now(),
        });
    },
});

export const updateOrderItemStatus = mutation({
    args: {
        orderItemId: v.id("orderItems"),
        deliveryStatus: deliveryStatusValidator,
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.orderItemId, {
            deliveryStatus: args.deliveryStatus,
        });
    },
});