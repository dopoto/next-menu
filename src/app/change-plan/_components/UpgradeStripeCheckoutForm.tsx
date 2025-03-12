"use client";
import React, { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { env } from "~/env";
import { type PriceTierId } from "~/app/_domain/price-tiers";
import { changePlanUpgradeCreateCheckoutSession } from "~/app/actions/changePlanUpgradeCreateCheckoutSession";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export const UpgradeStripeCheckoutForm = (props: {
  fromTierId: PriceTierId;
  toTierId: PriceTierId;
}) => {
  const { fromTierId, toTierId } = props;
  const fetchClientSecret = useCallback(async () => {
    const stripeResponse = await changePlanUpgradeCreateCheckoutSession({
      fromTierId,
      toTierId,
    });
    return stripeResponse.clientSecret;
  }, [fromTierId,  toTierId]);

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};
