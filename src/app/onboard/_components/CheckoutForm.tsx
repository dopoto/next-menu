"use client";
import React, { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { onboardCreateCheckoutSession } from "~/app/actions/onboardCreateCheckoutSession";
import { env } from "~/env";
import { type PriceTierId } from "~/app/_domain/price-tiers";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export const CheckoutForm = (props: { priceTierId: PriceTierId }) => {
  const fetchClientSecret = useCallback(async () => {
    const stripeResponse = await onboardCreateCheckoutSession({
      priceTierId: props.priceTierId,
    });
    return stripeResponse.clientSecret;
  }, [props.priceTierId]);

  // TODO preoppulatate wth customer details - e.g. email?

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};
