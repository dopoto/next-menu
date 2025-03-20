"use server";

//TODO https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#step-4-instrument-nextjs-server-actions-optional

import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { PriceTierIdSchema } from "../_domain/price-tiers";
import Stripe from "stripe";
import { env } from "~/env";
import { addCustomer, addLocation } from "~/server/queries";
import { isPaidPriceTier } from "~/app/_utils/price-tier-utils";
import { stripeCustomerIdSchema } from "../_domain/stripe";

const stripeApiKey = env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeApiKey);

const formDataSchema = z.object({
  locationName: z
    .string({
      required_error: "Location Name is required",
      invalid_type_error: "Location Name must be a string",
    })
    .min(5, {
      message: "Location Name must be 5 or more characters long",
    })
    .max(256, {
      message: "Location Name must be 256 or fewer characters long",
    }),
  priceTierId: PriceTierIdSchema,
  stripeSessionId: z.string(),
});

export const onboardingAddLocation = async (formData: FormData) => {
  const { userId, orgId } = await auth();

  // TODO Validate user role

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
      // TODO Log / Return error
      // TODO CTAs
      return {
        errors: ["Stripe payment data not found. Please start over"],
      };
    }

    try {
      const session = await stripe.checkout.sessions.retrieve(
        validatedFormFields.data.stripeSessionId,
      );

      const validationResult = stripeCustomerIdSchema.safeParse(
        session.customer,
      );
      if (!validationResult.success) {
        throw new Error(`Invalid Stripe customer id`);
      }
      validatedStripeCustomerIdOrNull = validationResult.data;

      switch (session.status) {
        case "complete":
          // The only happy path => continue
          break;
        case "expired":
          // TODO Log / Return error
          // TODO CTAs
          return {
            errors: ["Stripe payment data expired. Please start over"],
          };
        case "open":
          // TODO Log / Return error
          // TODO CTAs
          // TODO Revisit / test
          return {
            errors: ["Stripe payment not completed."],
          };
        default:
          // TODO Log / Return error
          // TODO CTAs
          // TODO Revisit / test
          return {
            errors: ["Unexpected Stripe payment data."],
          };
      }
    } catch {
      // TODO Log / Return error
      // TODO CTAs
      // TODO Revisit / test
      return {
        errors: ["An error occurred while processing your request."],
      };
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
    return {
      errors: ["No valid organization found. Please start over"],
    };
  }

  // Make sure we don't have a customer with this org id in the db already
  // const existingDbCustomer = await getCustomerByOrgId(orgId)
  // if(existingDbCustomer){
  //   return {
  //     errors: ["This org already exists."],
  //   };
  // }

  try {
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

    //TODO delete onboiarded tier cookie

    return { message: res.publicMetadata };
  } catch {
    // TODO log error
    return { errors: ["There was an error updating the user metadata."] };
  }
};
