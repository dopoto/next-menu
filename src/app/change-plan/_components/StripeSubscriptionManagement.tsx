"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { type PriceTierId, priceTiers } from "~/app/_domain/price-tiers";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { env } from "~/env";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

// Initialize Stripe
const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

type StripeSubscriptionManagementProps = {
  currentTierId: PriceTierId;
  targetTierId: PriceTierId;
  hasSubscription: boolean;
  userId: string;
};

// API response types
type CheckoutSessionResponse = {
  clientSecret: string;
  message?: string;
};

type SubscriptionActionResponse = {
  success?: boolean;
  error?: string;
  message?: string;
};

export function StripeSubscriptionManagement({
  currentTierId,
  targetTierId,
  hasSubscription,
  userId,
}: StripeSubscriptionManagementProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Determine the scenario
  const isUpgradeFromFree = currentTierId === "start" && targetTierId !== "start";
  const isDowngradeToFree = currentTierId !== "start" && targetTierId === "start";
  const isPaidToPaid = currentTierId !== "start" && targetTierId !== "start";
  const isUpgrade = isPaidToPaid && priceTiers[targetTierId].monthlyUsdPrice > priceTiers[currentTierId].monthlyUsdPrice;

  // Handle new subscription (from free to paid)
  const handleNewSubscription = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create a checkout session for the new subscription
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: priceTiers[targetTierId].stripePriceId,
          userId,
        }),
      });
      
      const data = await response.json() as CheckoutSessionResponse;
      
      if (!response.ok) {
        throw new Error(data.message ?? "Failed to create checkout session");
      }
      
      setClientSecret(data.clientSecret);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle subscription update (paid to paid)
  const handleSubscriptionUpdate = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the server action to update the subscription
      const result = await fetch("/api/stripe/update-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          targetTierId,
          isUpgrade,
        }),
      }).then(res => res.json()) as SubscriptionActionResponse;
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setSuccess(
        isUpgrade
          ? "Your subscription has been upgraded successfully! The new features are now available."
          : "Your subscription will be downgraded at the end of your current billing cycle."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle subscription cancellation (paid to free)
  const handleSubscriptionCancellation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the server action to cancel the subscription
      const result = await fetch("/api/stripe/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      }).then(res => res.json()) as SubscriptionActionResponse;
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setSuccess(
        "Your subscription has been cancelled. You will be downgraded to the Free plan at the end of your current billing cycle."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // If we have a client secret, show the embedded checkout
  if (clientSecret) {
    return (
      <div className="w-full">
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    );
  }

  // If we have an error, show it
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // If we have a success message, show it
  if (success) {
    return (
      <Alert variant="default" className="mb-4 border-green-500 bg-green-50">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>{success}</AlertDescription>
      </Alert>
    );
  }

  // Render the appropriate button based on the scenario
  return (
    <Button
      onClick={
        isUpgradeFromFree
          ? handleNewSubscription
          : isDowngradeToFree
          ? handleSubscriptionCancellation
          : handleSubscriptionUpdate
      }
      disabled={isLoading}
      className="w-full"
    >
      {isLoading
        ? "Processing..."
        : isUpgradeFromFree
        ? `Subscribe to ${priceTiers[targetTierId].name}`
        : isDowngradeToFree
        ? "Cancel Subscription"
        : isUpgrade
        ? `Upgrade to ${priceTiers[targetTierId].name}`
        : `Downgrade to ${priceTiers[targetTierId].name}`}
    </Button>
  );
} 