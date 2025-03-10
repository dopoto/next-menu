// import { NextRequest, NextResponse } from "next/server";
// import { Stripe } from "stripe";
// import { env } from "~/env";
// import { auth, clerkClient } from "@clerk/nextjs/server";
// import { type PriceTierId, priceTiers } from "~/app/_domain/price-tiers";

// // Initialize Stripe
// const stripe = new Stripe(env.STRIPE_SECRET_KEY);

// export async function POST(request: NextRequest) {
//   try {
//     // Get the authenticated user
//     const { userId } = auth();
    
//     if (!userId) {
//       return NextResponse.json(
//         { message: "Unauthorized" },
//         { status: 401 }
//       );
//     }
    
//     // Parse the request body
//     const { targetTierId, isUpgrade } = await request.json();
    
//     if (!targetTierId) {
//       return NextResponse.json(
//         { message: "Target tier ID is required" },
//         { status: 400 }
//       );
//     }
    
//     // Get the user's Stripe customer ID
//     const user = await clerkClient.users.getUser(userId);
//     const stripeCustomerId = user.privateMetadata.stripeCustomerId as string;
    
//     if (!stripeCustomerId) {
//       return NextResponse.json(
//         { message: "No Stripe customer ID found for this user" },
//         { status: 400 }
//       );
//     }
    
//     // Get the user's active subscriptions
//     const subscriptions = await stripe.subscriptions.list({
//       customer: stripeCustomerId,
//       status: "active",
//     });
    
//     if (subscriptions.data.length === 0) {
//       return NextResponse.json(
//         { message: "No active subscription found" },
//         { status: 400 }
//       );
//     }
    
//     // Get the first active subscription
//     const subscription = subscriptions.data[0];
    
//     // Get the new price ID
//     const newPriceId = priceTiers[targetTierId as PriceTierId].stripePriceId;
    
//     if (!newPriceId) {
//       return NextResponse.json(
//         { message: "No price ID found for the target tier" },
//         { status: 400 }
//       );
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
    
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error updating subscription:", error);
//     return NextResponse.json(
//       { message: error instanceof Error ? error.message : "An unknown error occurred" },
//       { status: 500 }
//     );
//   }
// } 