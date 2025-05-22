'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import * as Sentry from '@sentry/nextjs';
import { cookies, headers } from 'next/headers';
import Stripe from 'stripe';
import { type z } from 'zod';
import { CookieKey } from '~/domain/cookies';
import { type CurrencyId } from '~/domain/currencies';
import { locationFormSchema } from '~/domain/locations';
import { type PriceTierId } from '~/domain/price-tiers';
import { stripeCustomerIdSchema } from '~/domain/stripe';
import { env } from '~/env';
import { AppError } from '~/lib/error-utils.server';
import { getValidPriceTier, isPaidPriceTier } from '~/lib/price-tier-utils';
import { generateUniqueLocationSlug } from '~/server/queries/locations';
import { createOrganization } from '~/server/queries/organizations';

const stripeApiKey = env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeApiKey);

export const onboardCreateOrganizationAction = async (
    priceTierId: PriceTierId,
    stripeSessionId: string,
    data: z.infer<typeof locationFormSchema>,
) => {
    'use server';
    return await Sentry.withServerActionInstrumentation(
        'onboardCreateOrganization',
        {
            headers: headers(),
            recordResponse: true,
        },
        async () => {
            try {
                const cookieStore = await cookies();
                cookieStore.delete(CookieKey.CurrentLocationName); //TODO review

                const { userId, orgId } = await auth();
                if (!userId) {
                    return { errors: ['You must be authenticated.'] };
                }

                const validPriceTier = getValidPriceTier(priceTierId);
                if (!validPriceTier) {
                    return { errors: ['An error occurred while validating tier data. Please start over.'] };
                }

                const validatedFormFields = locationFormSchema.safeParse({
                    locationName: data.locationName,
                    currencyId: data.currencyId,
                    menuMode: data.menuMode,
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

                if (isPaidPriceTier(validPriceTier.id)) {
                    if (stripeSessionId.length === 0) {
                        throw new AppError({
                            publicMessage: 'Stripe payment data not found. Please try onboarding again.',
                        });
                    }

                    const session = await stripe.checkout.sessions.retrieve(stripeSessionId);

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
                    locationSlug: await generateUniqueLocationSlug(),
                    menuMode: validatedFormFields.data.menuMode,
                    currencyId: validatedFormFields.data.currencyId as CurrencyId,
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
                        tier: validPriceTier.id,
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
