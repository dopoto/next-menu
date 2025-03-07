import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";
import { env } from "~/env";
import { auth, clerkClient } from "@clerk/nextjs/server";

// Initialize Stripe
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get the user's Stripe customer ID
    const user = await clerkClient.users.getUser(userId);
    const stripeCustomerId = user.privateMetadata.stripeCustomerId as string;
    
    if (!stripeCustomerId) {
      return NextResponse.json(
        { message: "No Stripe customer ID found for this user" },
        { status: 400 }
      );
    }
    
    // Get the user's active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: "active",
    });
    
    if (subscriptions.data.length === 0) {
      return NextResponse.json(
        { message: "No active subscription found" },
        { status: 400 }
      );
    }
    
    // Get the first active subscription
    const subscription = subscriptions.data[0];
    
    // Cancel the subscription at the end of the billing period
    await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    });
    
    // Update the user's metadata to indicate pending downgrade
    await clerkClient.users.updateUser(userId, {
      privateMetadata: {
        ...user.privateMetadata,
        pendingDowngradeToFree: true,
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 }
    );
  }
} 