'use server';

//TODO https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#step-4-instrument-nextjs-server-actions-optional

import { auth, clerkClient } from '@clerk/nextjs/server';
import * as Sentry from '@sentry/nextjs';
import { cookies, headers } from 'next/headers';
import Stripe from 'stripe';
import { z } from 'zod';
import { isPaidPriceTier } from '~/app/_utils/price-tier-utils';
import { CookieKey } from '~/domain/cookies';
import { PriceTierIdSchema } from '~/domain/price-tiers';
import { stripeCustomerIdSchema } from '~/domain/stripe';
import { env } from '~/env';
import { AppError } from '~/lib/error-utils.server';
import { createOrganization } from '~/server/queries/organization';

const stripeApiKey = env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeApiKey);

const formDataSchema = z.object({
    locationName: z
        .string({
            required_error: 'Location Name is required',
            invalid_type_error: 'Location Name must be a string',
        })
        .min(2, {
            message: 'Location Name must be 2 or more characters long',
        })
        .max(256, {
            message: 'Location Name must be 256 or fewer characters long',
        }),
    priceTierId: PriceTierIdSchema,
    slug: z
        .string({
            required_error: 'Slug is required',
            invalid_type_error: 'Slug must be a string',
        })
        .min(2, {
            message: 'Slug must be 2 or more characters long',
        })
        .max(50, {
            message: 'Slug must be 50 or fewer characters long',
        }),
    stripeSessionId: z.string(),
});

export const onboardCreateOrganization = async (formData: FormData) => {
    'use server';
    return await Sentry.withServerActionInstrumentation(
        'onboardCreateOrganization',
        {
            formData,
            headers: headers(),
            recordResponse: true,
        },
        async () => {
            try {
                const cookieStore = await cookies();
                cookieStore.delete(CookieKey.CurrentLocationName);

                const { userId, orgId } = await auth();
                if (!userId) {
                    return { errors: ['You must be authenticated.'] };
                }

                const validatedFormFields = formDataSchema.safeParse({
                    locationName: formData.get('locationName'),
                    priceTierId: formData.get('priceTierId'),
                    slug: formData.get('slug'),
                    stripeSessionId: formData.get('stripeSessionId'),
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
                        throw new AppError({
                            publicMessage: 'Stripe payment data not found. Please try onboarding again.',
                        });
                    }

                    const session = await stripe.checkout.sessions.retrieve(validatedFormFields.data.stripeSessionId);

                    const validationResult = stripeCustomerIdSchema.safeParse(session.customer);
                    if (!validationResult.success) {
                        throw new AppError({ publicMessage: `Invalid Stripe data` });
                    }
                    validatedStripeCustomerIdOrNull = validationResult.data;

                    switch (session.status) {
                        case 'complete':
                            // The only happy path => continue
                            break;
                        case 'expired':
                            throw new AppError({
                                publicMessage: `Stripe payment data expired. Please try onboarding again.`,
                            });
                        case 'open':
                            throw new AppError({
                                publicMessage: `Stripe payment not completed. Please try onboarding again.`,
                            });
                        default:
                            throw new AppError({
                                publicMessage: `Unexpected Stripe payment data.`,
                            });
                    }
                }

                const client = await clerkClient();

                let orgName = '';
                if (orgId) {
                    const organization = await client.organizations.getOrganization({
                        organizationId: orgId,
                    });
                    orgName = organization.name;
                }

                if (!orgId || !orgName) {
                    throw new AppError({
                        internalMessage: `No valid organization found.`,
                        publicMessage: `No valid organization found. Please restart your onboarding.`,
                    });
                }

                // TODO
                // Make sure we don't have a customer with this org id in the db already
                // const existingDbCustomer = await getCustomerByOrgId(orgId)
                // if(existingDbCustomer){
                //   return {
                //     errors: ["This org already exists."],
                //   };
                // }

                const currentLocation = await createOrganization({
                    clerkUserId: userId,
                    orgId,
                    stripeCustomerId: validatedStripeCustomerIdOrNull,
                    locationName: validatedFormFields.data.locationName,
                    locationSlug: validatedFormFields.data.slug,
                });

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
                        initialLocationId: currentLocation.id.toString(),
                    },
                };
                const res = await client.users.updateUser(userId, {
                    publicMetadata: customJwtSessionClaims.metadata,
                });

                cookieStore.delete(CookieKey.OnboardPlan);
                cookieStore.set(CookieKey.CurrentLocationId, currentLocation.id.toString());
                cookieStore.set(CookieKey.CurrentLocationName, currentLocation.name.toString());

                return { message: res.publicMetadata };
            } catch (error) {
                if (error instanceof AppError) {
                    return {
                        eventId: error.publicErrorId,
                        errors: [error.publicMessage],
                    };
                } else {
                    return {
                        eventId: 'n/a',
                        errors: ['An error occurred during onboarding.'],
                    };
                }
            }
        },
    );
};
