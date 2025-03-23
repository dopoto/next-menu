"use server";

//TODO https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#step-4-instrument-nextjs-server-actions-optional

import * as Sentry from "@sentry/nextjs";
import { cookies, headers } from "next/headers";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { PriceTierIdSchema } from "../_domain/price-tiers";
import Stripe from "stripe";
import { env } from "~/env";
import { addCustomer, addLocation } from "~/server/queries";
import { isPaidPriceTier } from "~/app/_utils/price-tier-utils";
import { stripeCustomerIdSchema } from "../_domain/stripe";
import { generateErrorId } from "../_utils/error-logger-utils";
import { CookieKey } from "../_domain/cookies";

const stripeApiKey = env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeApiKey);

const formDataSchema = z.object({
  locationName: z
    .string({
      required_error: "Location Name is required",
      invalid_type_error: "Location Name must be a string",
    })
    .min(2, {
      message: "Location Name must be 2 or more characters long",
    })
    .max(256, {
      message: "Location Name must be 256 or fewer characters long",
    }),
  priceTierId: PriceTierIdSchema,
  stripeSessionId: z.string(),
});

export const onboardCreateCustomer = async (formData: FormData) => {
  "use server";
  return await Sentry.withServerActionInstrumentation(
    "onboardCreateCustomer",
    {
      formData,
      headers: headers(),
      recordResponse: true,
    },
    async () => {
      try {
        const { userId, orgId } = await auth();
        if (!userId) {
          return { errors: ["You must be authenticated."] };
        }

        const validatedFormFields = formDataSchema.safeParse({
          locationName: formData.get("locationName"),
          priceTierId: formData.get("priceTierId"),
          stripeSessionId: formData.get("stripeSessionId"),
        });

        if (!validatedFormFields.success) {
          const fieldErrors = validatedFormFields.error.flatten().fieldErrors;
          const errorMessages = Object.entries(fieldErrors)
            .map(([, errors]) => errors)
            .flat();
          return {
            errors: errorMessages,
          };
        }

        let validatedStripeCustomerIdOrNull;

        if (isPaidPriceTier(validatedFormFields.data.priceTierId)) {
          if (validatedFormFields.data.stripeSessionId?.length === 0) {
            throw new Error(
              "Stripe payment data not found. Please try onboarding again.",
            );
          }

          const session = await stripe.checkout.sessions.retrieve(
            validatedFormFields.data.stripeSessionId,
          );

          const validationResult = stripeCustomerIdSchema.safeParse(
            session.customer,
          );
          if (!validationResult.success) {
            throw new Error(`Invalid Stripe data`);
          }
          validatedStripeCustomerIdOrNull = validationResult.data;

          switch (session.status) {
            case "complete":
              // The only happy path => continue
              break;
            case "expired":
              throw new Error(
                `Stripe payment data expired. Please try onboarding again.`,
              );
            case "open":
              throw new Error(
                `Stripe payment not completed. Please try onboarding again.`,
              );
            default:
              throw new Error(`Unexpected Stripe payment data.`);
          }
        }

        const client = await clerkClient();

        let orgName = "";
        if (orgId) {
          const organization = await client.organizations.getOrganization({
            organizationId: orgId,
          });
          orgName = organization.name;
        }

        if (!orgId || !orgName) {
          throw new Error(`No valid organization found. Please start over.`);
        }

        // TODO
        // Make sure we don't have a customer with this org id in the db already
        // const existingDbCustomer = await getCustomerByOrgId(orgId)
        // if(existingDbCustomer){
        //   return {
        //     errors: ["This org already exists."],
        //   };
        // }

        await addCustomer(userId, orgId, validatedStripeCustomerIdOrNull);

        const insertedLocation = await addLocation(
          orgId,
          validatedFormFields.data.locationName,
        );

        // TODO send analytics
        // analyticsServerClient.capture({
        //   distinctId: user.userId,
        //   event: "delete image",
        //   properties: {
        //     imageId: id,
        //   },
        // });

        const customJwtSessionClaims: CustomJwtSessionClaims = {
          metadata: {
            tier: validatedFormFields.data.priceTierId,
            orgName,
            currentLocationId: insertedLocation?.id.toString() ?? "",
            currentLocationName: validatedFormFields.data.locationName,
          },
        };
        const res = await client.users.updateUser(userId, {
          publicMetadata: customJwtSessionClaims.metadata,
        });

        const cookieStore = await cookies();
        cookieStore.delete(CookieKey.OnboardPlan);

        return { message: res.publicMetadata };
      } catch (error) {
        const eventId = generateErrorId();
        Sentry.captureException(error, { event_id: eventId });
        const userMessage =
          error instanceof Error
            ? error.message
            : "An error occurred during onboarding.";
        return { eventId, errors: [userMessage] };
      }
    },
  );
};
