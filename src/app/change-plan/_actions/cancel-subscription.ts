"use server";

import { Stripe } from "stripe";
import { env } from "~/env";
import { clerkClient } from "@clerk/nextjs/server";

// Initialize Stripe
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

type CancelSubscriptionParams = {
  userId: string;
};

type CancelSubscriptionResult = {
  success?: boolean;
  error?: string;
};

export async function cancelSubscription({
  userId,
}: CancelSubscriptionParams): Promise<CancelSubscriptionResult> {
  try {
    // Get the user's Stripe customer ID from Clerk
    const user = await clerkClient.users.getUser(userId);
    const stripeCustomerId = user.privateMetadata.stripeCustomerId as string;
    
    if (!stripeCustomerId) {
      return { error: "No Stripe customer ID found for this user" };
    }
    
    // Get the user's active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: "active",
    });
    
    if (subscriptions.data.length === 0) {
      return { error: "No active subscription found" };
    }
    
    // Get the first active subscription
    const subscription = subscriptions.data[0];
    
    // Cancel the subscription at the end of the billing period
    await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    });
    
    // Update the user's tier in Clerk to indicate pending downgrade
    await clerkClient.users.updateUser(userId, {
      privateMetadata: {
        ...user.privateMetadata,
        pendingDowngradeToFree: true,
      },
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return {
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
} 