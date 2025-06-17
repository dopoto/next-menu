import { v } from "convex/values";
import { deliveryStatusValues } from '../src/domain/order-items'

export const deliveryStatusValidator = v.union(
    ...deliveryStatusValues.map(status => v.literal(status))
);