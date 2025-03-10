// "use server";

// import { Stripe } from "stripe";
// import { env } from "~/env";
// import { priceTiers, type PriceTierId } from "~/app/_domain/price-tiers";
// import { clerkClient } from "@clerk/nextjs/server";

// // Initialize Stripe
// const stripe = new Stripe(env.STRIPE_SECRET_KEY);

// type UpdateSubscriptionParams = {
//   userId: string;
//   targetTierId: PriceTierId;
//   isUpgrade: boolean;
// };

// type UpdateSubscriptionResult = {
//   success?: boolean;
//   error?: string;
// };

// export async function updateSubscription({
//   userId,
//   targetTierId,
//   isUpgrade,
// }: UpdateSubscriptionParams): Promise<UpdateSubscriptionResult> {
//   try {
//     // Get the user's Stripe customer ID from Clerk
//     const user = await clerkClient.users.getUser(userId);
//     const stripeCustomerId = user.privateMetadata.stripeCustomerId as string;
    
//     if (!stripeCustomerId) {
//       return { error: "No Stripe customer ID found for this user" };
//     }
    
//     // Get the user's active subscriptions
//     const subscriptions = await stripe.subscriptions.list({
//       customer: stripeCustomerId,
//       status: "active",
//     });
    
//     if (subscriptions.data.length === 0) {
//       return { error: "No active subscription found" };
//     }
    
//     // Get the first active subscription
//     const subscription = subscriptions.data[0];
    
//     // Get the new price ID
//     const newPriceId = priceTiers[targetTierId].stripePriceId;
    
//     if (!newPriceId) {
//       return { error: "No price ID found for the target tier" };
//     }
    
//     // Update the subscription with the new price
//     await stripe.subscriptions.update(subscription.id, {
//       items: [
//         {
//           id: subscription.items.data[0].id,
//           price: newPriceId,
//         },
//       ],
//       // For upgrades, prorate immediately and create an invoice
//       // For downgrades, apply at the end of the billing period
//       proration_behavior: isUpgrade ? "always_invoice" : "none",
//     });
    
//     // Update the user's tier in Clerk
//     await clerkClient.users.updateUser(userId, {
//       privateMetadata: {
//         ...user.privateMetadata,
//         tier: targetTierId,
//       },
//     });
    
//     return { success: true };
//   } catch (error) {
//     console.error("Error updating subscription:", error);
//     return {
//       error: error instanceof Error ? error.message : "An unknown error occurred",
//     };
//   }
// } 