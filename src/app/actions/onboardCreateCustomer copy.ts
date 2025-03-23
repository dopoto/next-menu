// "use server";

// //TODO https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#step-4-instrument-nextjs-server-actions-optional

// import * as Sentry from "@sentry/nextjs";
// import { cookies, headers } from "next/headers";
// import { auth, clerkClient } from "@clerk/nextjs/server";
// import { z } from "zod";
// import { PriceTierId, PriceTierIdSchema } from "../_domain/price-tiers";
// import Stripe from "stripe";
// import { env } from "~/env";
// import { addCustomer, addLocation } from "~/server/queries";
// import { isPaidPriceTier } from "~/app/_utils/price-tier-utils";
// import { stripeCustomerIdSchema } from "../_domain/stripe";
// import { generateErrorId } from "../_utils/error-logger-utils";
// import { CookieKey } from "../_domain/cookies";
// import { createServerValidate, ServerValidateError } from "@tanstack/react-form/nextjs";
// import { addLocationFormDataSchema, addLocationFormOptions } from "../_domain/locations";

// const stripeApiKey = env.STRIPE_SECRET_KEY;
// const stripe = new Stripe(stripeApiKey);




// const xaddLocationServerValidate = createServerValidate({
//   ...addLocationFormOptions,
//   onServerValidate: ({ value }) => {
//     if (value.locationName === 'z') {
//       return 'Server validation: Cannot z'
//     }
 
//     // const validatedFormFields = addLocationFormDataSchema.safeParse({
//     //   locationName: value.locationName,
//     //   priceTierId: value.priceTierId,
//     //   stripeSessionId: value.stripeSessionId
//     // });

//     // if (!validatedFormFields.success) {
//     //   const fieldErrors = validatedFormFields.error.flatten().fieldErrors;
//     //   const errorMessages = Object.entries(fieldErrors)
//     //     .map(([, errors]) => errors)
//     //     .flat();
//     //   return {
//     //     errors: errorMessages,
//     //   };
//     // }
//   },
// })

// export const xonboardCreateCustomer = async (prev: unknown, formData: FormData) => {
//   "use server";
//   return await Sentry.withServerActionInstrumentation(
//     "onboardCreateCustomer",
//     {
//       formData,
//       headers: headers(),
//       recordResponse: true,
//     },
//     async () => {
//       // Validate Add Location form data:      
//       try {
//          await addLocationServerValidate(formData);       
//       } catch (e) {
//         if (e instanceof ServerValidateError) {
//           return e.formState
//         }    
//         // Some other error occurred while validating the form
//         throw e
//       }

//       // At this point we should have validate form vlaues
//       const validatedFormFields = addLocationFormDataSchema.safeParse({
//         locationName: formData.get("locationName"),
//         priceTierId: formData.get("priceTierId"),
//         stripeSessionId: formData.get("stripeSessionId"),
//       });
//       const validatedLocationName = validatedFormFields.data?.locationName ?? '';
//       const validatedPaidPriceTierId = validatedFormFields.data?.priceTierId as PriceTierId ?? ''
//       const validatedStripeSessionId = validatedFormFields.data?.stripeSessionId ??'';
 
//       try {
//         const { userId, orgId } = await auth();
//         if (!userId) {
//           return { errors: ["You must be authenticated."] };
//         }



//         let validatedStripeCustomerIdOrNull;

//         if (isPaidPriceTier(validatedPaidPriceTierId)) { //TODO
//           if (validatedStripeSessionId?.length === 0) {
//             throw new Error(
//               "Stripe payment data not found. Please try onboarding again.",
//             );
//           }

//           const session = await stripe.checkout.sessions.retrieve(
//             validatedStripeSessionId
//           );

//           const validationResult = stripeCustomerIdSchema.safeParse(
//             session.customer,
//           );
//           if (!validationResult.success) {
//             throw new Error(`Invalid Stripe data`);
//           }
//           validatedStripeCustomerIdOrNull = validationResult.data;

//           switch (session.status) {
//             case "complete":
//               // The only happy path => continue
//               break;
//             case "expired":
//               throw new Error(
//                 `Stripe payment data expired. Please try onboarding again.`,
//               );
//             case "open":
//               throw new Error(
//                 `Stripe payment not completed. Please try onboarding again.`,
//               );
//             default:
//               throw new Error(`Unexpected Stripe payment data.`);
//           }
//         }

//         const client = await clerkClient();

//         let orgName = "";
//         if (orgId) {
//           const organization = await client.organizations.getOrganization({
//             organizationId: orgId,
//           });
//           orgName = organization.name;
//         }

//         if (!orgId || !orgName) {
//           throw new Error(`No valid organization found. Please start over.`);
//         }

//         // TODO
//         // Make sure we don't have a customer with this org id in the db already
//         // const existingDbCustomer = await getCustomerByOrgId(orgId)
//         // if(existingDbCustomer){
//         //   return {
//         //     errors: ["This org already exists."],
//         //   };
//         // }

//         // await addCustomer(userId, orgId, validatedStripeCustomerIdOrNull);

//         // const insertedLocation = await addLocation(
//         //   orgId,
//         //   validatedLocationName,
//         // );

//         // // TODO send analytics
//         // // analyticsServerClient.capture({
//         // //   distinctId: user.userId,
//         // //   event: "delete image",
//         // //   properties: {
//         // //     imageId: id,
//         // //   },
//         // // });

//         // const customJwtSessionClaims: CustomJwtSessionClaims = {
//         //   metadata: {
//         //     tier: validatedFormFields.data.priceTierId,
//         //     orgName,
//         //     currentLocationId: insertedLocation?.id.toString() ?? "",
//         //     currentLocationName: validatedFormFields.data.locationName,
//         //   },
//         // };
//         // const res = await client.users.updateUser(userId, {
//         //   publicMetadata: customJwtSessionClaims.metadata,
//         // });

//         // const cookieStore = await cookies();
//         // cookieStore.delete(CookieKey.OnboardPlan);

//         //return { message: res.publicMetadata };
//         return { success : true};

//       } catch (error) {
//         const eventId = generateErrorId();
//         Sentry.captureException(error, { event_id: eventId });
//         const userMessage =
//           error instanceof Error
//             ? error.message
//             : "An error occurred during onboarding.";
//         return { eventId, errors: [userMessage] };
//       }
//     },
//   );
// };
