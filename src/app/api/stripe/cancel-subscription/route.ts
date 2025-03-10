// import { auth, clerkClient } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import { Stripe } from "stripe";
// import { env } from "~/env";

// // Initialize Stripe
// const stripe = new Stripe(env.STRIPE_SECRET_KEY);

// export async function POST() {
//   try {
//     // Get authenticated user
//     const authResult = await auth();
//     const userId = authResult.userId;
//     const orgId = authResult.orgId;

//     if (!userId || !orgId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const subscriptions2 = await stripe.subscriptions.list({
//       customer: orgId,
//     });

//     // Find subscriptions for this organization
//     const subscriptions = await stripe.subscriptions.list({
//       limit: 10,
//       expand: ["data.default_payment_method"],
//     });

//     // Filter subscriptions to find ones with matching orgId in metadata
//     const orgSubscriptions = subscriptions.data.filter(
//       (sub) => sub.metadata.orgId === orgId,
//     );

//     if (orgSubscriptions.length === 0) {
//       return new NextResponse("No active subscription found", { status: 404 });
//     }

//     // Get the first active subscription
//     const subscription = orgSubscriptions[0];
//     if (!subscription) {
//       return new NextResponse("No active subscription found", { status: 404 });
//     }

//     // Cancel the subscription at period end
//     await stripe.subscriptions.update(subscription.id, {
//       cancel_at_period_end: true,
//       metadata: {
//         ...subscription.metadata,
//         pendingDowngradeToFree: "true",
//       },
//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error canceling subscription:", error);
//     return new NextResponse(
//       error instanceof Error ? error.message : "Internal Server Error",
//       { status: 500 },
//     );
//   }
// }
