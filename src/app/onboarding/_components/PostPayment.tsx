import Link from "next/link";
import type Stripe from "stripe";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";

export const PostPayment = (props: {
  tierId: string;
  stripeSession: Stripe.Response<Stripe.Checkout.Session>;
}) => {
  // The status of the Checkout Session, one of open, complete, or expired
  const status = props.stripeSession.status;

  switch (status) {
    case "complete":
      return (
        <Card>
          <CardHeader><h1>Your payment was processed successfully!</h1></CardHeader>
          {/* TODO Tx summary */}
          {/* <CardContent></CardContent> */}
          <CardFooter>
           
            <Link
              className="w-full"
              href={`/onboarding/${props.tierId}/add-location?session_id=${props.stripeSession?.id}`}
            >
              <Button variant="default" className="w-full">
                Go to next step
              </Button>
            </Link>
          </CardFooter>
        </Card>
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
