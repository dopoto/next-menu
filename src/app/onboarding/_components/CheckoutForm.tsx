"use client";
import React, { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { onboardingCreateCheckoutSession } from "~/app/actions/onboardingCreateCheckoutSession";
import { env } from "~/env";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export const CheckoutForm = ({ priceId }: { priceId: string }) => {
  const fetchClientSecret = useCallback(async () => {
    const stripeResponse = await onboardingCreateCheckoutSession({ priceId });
    return stripeResponse.clientSecret;
  }, [priceId]);

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};
