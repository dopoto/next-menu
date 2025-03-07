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
    
    // Parse the request body
    const { priceId } = await request.json();
    
    if (!priceId) {
      return NextResponse.json(
        { message: "Price ID is required" },
        { status: 400 }
      );
    }
    
    // Get or create a Stripe customer for the user
    const user = await clerkClient.users.getUser(userId);
    let stripeCustomerId = user.privateMetadata.stripeCustomerId as string;
    
    if (!stripeCustomerId) {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0]?.emailAddress,
        name: `${user.firstName} ${user.lastName}`,
        metadata: {
          userId,
        },
      });
      
      stripeCustomerId = customer.id;
      
      // Save the Stripe customer ID to the user's metadata
      await clerkClient.users.updateUser(userId, {
        privateMetadata: {
          ...user.privateMetadata,
          stripeCustomerId,
        },
      });
    }
    
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      return_url: `${env.NEXT_PUBLIC_APP_URL}/change-plan/success?session_id={CHECKOUT_SESSION_ID}`,
      subscription_data: {
        metadata: {
          userId,
        },
      },
    });
    
    if (!session.client_secret) {
      throw new Error("Failed to create checkout session");
    }
    
    return NextResponse.json({
      clientSecret: session.client_secret,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 }
    );
  }
} 