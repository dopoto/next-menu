import Link from "next/link";
import type Stripe from "stripe";
import { PriceTierId, priceTiers } from "~/app/_domain/price-tiers";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export const PostPayment = (props: {
  tierId: PriceTierId;
  stripeSession: Stripe.Response<Stripe.Checkout.Session>;
}) => {
  // The status of the Checkout Session, one of open, complete, or expired
  const status = props.stripeSession.status;

  switch (status) {
    case "complete":
      return (
        <OrderComplete
          tierId={props.tierId}
          stripeSession={props.stripeSession}
        />
      );
    case "open":
      return (
        <Card>
          <CardContent>Your payment is being processed.</CardContent>
          <CardFooter>TODO</CardFooter>
        </Card>
      );
    case "expired":
      return (
        <Card>
          <CardContent>Your payment expired.</CardContent>
          <CardFooter>
            <Link href={`/onboarding/${props.tierId}/payment`}>Try again</Link>
          </CardFooter>
        </Card>
      );
    default:
      return (
        <Card>
          <CardContent>An error occurred</CardContent>
          <CardFooter>TODO</CardFooter>
        </Card>
      );
  }
};

export const OrderComplete = (props: {
  tierId: PriceTierId;
  stripeSession: Stripe.Response<Stripe.Checkout.Session>;
}) => {
  const {
    customer_details,
    amount_total,
    currency,
    payment_status,
    created,
    mode,
    subscription,
  } = props.stripeSession;
  const formattedDate = new Date(created * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency ?? "",
    minimumFractionDigits: 2,
  }).format((amount_total ?? 0) / 100);

  return (
    <>
      <Card className="  text-m font-light">
        <CardHeader>
          <h1>Order summary</h1>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-1">
            <h3 className="text-muted-foreground text-sm font-semibold">
              CUSTOMER INFORMATION
            </h3>
            <p className="font-medium">{customer_details?.name}</p>
            <p className="text-muted-foreground">{customer_details?.email}</p>
            {customer_details?.address?.country && (
              <p className="text-muted-foreground">
                Country: {customer_details.address.country}
              </p>
            )}
          </div>

          <Separator />
          {/* TODO Invoice  */}
          <div className="space-y-3">
            <h3 className="text-muted-foreground text-sm font-semibold">
              PAYMENT DETAILS
            </h3>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Type</span>
              <span className="capitalize">{mode}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>
                {formattedAmount} {currency?.toLocaleUpperCase()}
              </span>
            </div>
          </div>

          {subscription && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-muted-foreground text-sm font-semibold">
                  SUBSCRIPTION
                </h3>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID</span>
                  <span>
                    {typeof subscription === "string"
                      ? subscription.toString()
                      : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tier</span>
                  <span className="capitalize">{priceTiers[props.tierId].name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="capitalize">ACTIVE</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <Link
        className="w-full"
        href={`/onboarding/${props.tierId}/add-location?session_id=${props.stripeSession?.id}`}
      >
        <Button variant="default" className="w-full">
          Go to next step
        </Button>
      </Link>
    </>
  );
};
