// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import { Stripe } from "stripe";
// import { env } from "~/env";
// import { PriceTierIdSchema } from "~/app/_domain/price-tiers";

// // Initialize Stripe
// const stripe = new Stripe(env.STRIPE_SECRET_KEY);

// type RequestBody = {
//   targetTierId: string;
//   isUpgrade: boolean;
// };

// export async function POST(request: Request) {
//   try {
//     // Get authenticated user
//     const authResult = await auth();
//     const userId = authResult.userId;
//     const orgId = authResult.orgId;

//     if (!userId || !orgId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     // Get request body
//     const body = (await request.json()) as RequestBody;
//     const { targetTierId, isUpgrade } = body;

//     // Validate target tier ID
//     const parsedTierId = PriceTierIdSchema.safeParse(targetTierId);
//     if (!parsedTierId.success) {
//       return new NextResponse("Invalid tier ID", { status: 400 });
//     }

//     // Find subscriptions for this organization
//     const subscriptions = await stripe.subscriptions.list({
//       limit: 10,
//       expand: ['data.default_payment_method'],
//     });
    
//     // Filter subscriptions to find ones with matching orgId in metadata
//     const orgSubscriptions = subscriptions.data.filter(
//       sub => sub.metadata.orgId === orgId
//     );

//     if (orgSubscriptions.length === 0) {
//       return new NextResponse("No active subscription found", { status: 404 });
//     }

//     // Get the first active subscription
//     const subscription = orgSubscriptions[0];
//     if (!subscription?.items?.data?.[0]?.id) {
//       return new NextResponse("Invalid subscription data", { status: 400 });
//     }

//     // Update the subscription
//     await stripe.subscriptions.update(subscription.id, {
//       items: [
//         {
//           id: subscription.items.data[0].id,
//           price: targetTierId,
//         },
//       ],
//       proration_behavior: isUpgrade ? "always_invoice" : "none",
//       metadata: {
//         ...subscription.metadata,
//         tierId: targetTierId,
//       },
//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error modifying subscription:", error);
//     return new NextResponse(
//       error instanceof Error ? error.message : "Internal Server Error",
//       { status: 500 }
//     );
//   }
// } 