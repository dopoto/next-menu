"use client";
import React, { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { env } from "~/env";
import { changePlanFreeToPaidCreateCheckoutSession } from "~/app/actions/changePlanFreeToPaidCreateCheckoutSession";
import { type PriceTierId } from "~/app/_domain/price-tiers";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export const FreeToPaidStripeCheckoutForm = (props: {
  fromTierId: PriceTierId;
  toTierId: PriceTierId;
  newStripeCustomerId: string;
}) => {
  const { fromTierId, toTierId, newStripeCustomerId } = props;
  const fetchClientSecret = useCallback(async () => {
    const stripeResponse = await changePlanFreeToPaidCreateCheckoutSession({
      fromTierId,
      toTierId,
      newStripeCustomerId,
    });
    return stripeResponse.clientSecret;
  }, [fromTierId, newStripeCustomerId, toTierId]);

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};
