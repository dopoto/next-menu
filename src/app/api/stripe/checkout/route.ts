// import { type NextRequest, NextResponse } from "next/server";
// import { Stripe } from "stripe";
// import { env } from "~/env";
// import { PriceTierIdSchema, priceTiers } from "~/app/_domain/price-tiers";
// import { auth } from "@clerk/nextjs/server";

// // Initialize Stripe
// const stripe = new Stripe(env.STRIPE_SECRET_KEY);

// export async function POST(request: NextRequest) {
//   try {
//     // Get authenticated user
//     const authResult = await auth();
//     const userId = authResult.userId;
//     const orgId = authResult.orgId;

//     if (!userId || !orgId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     // Get target tier ID from URL
//     const targetTierId = request.nextUrl.searchParams.get("targetTierId");
//     if (!targetTierId) {
//       return NextResponse.json({ error: "Target tier ID is required" }, { status: 400 });
//     }

//     // Validate target tier ID
//     const parsedTierId = PriceTierIdSchema.safeParse(targetTierId);
//     if (!parsedTierId.success) {
//       return NextResponse.json({ error: "Invalid target tier ID" }, { status: 400 });
//     }

//     // Get price ID for target tier
//     const priceId = priceTiers[parsedTierId.data].stripePriceId;
//     if (!priceId) {
//       return NextResponse.json({ error: "No price ID found for target tier" }, { status: 400 });
//     }

//     // Create checkout session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       customer: orgId,
//       line_items: [
//         {
//           price: priceId,
//           quantity: 1,
//         },
//       ],
//       mode: "subscription",
//       success_url: `${env.NEXT_PUBLIC_APP_URL}/change-plan/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${env.NEXT_PUBLIC_APP_URL}/change-plan`,
//       subscription_data: {
//         metadata: {
//           orgId: orgId,
//           tierId: targetTierId,
//         },
//       },
//     });

//     // Redirect to checkout
//     if (session.url) {
//       return NextResponse.redirect(session.url);
//     }
    
//     return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
//   } catch (error) {
//     console.error("Error creating checkout session:", error);
//     return NextResponse.json(
//       { error: error instanceof Error ? error.message : "An unknown error occurred" },
//       { status: 500 }
//     );
//   }
// } 