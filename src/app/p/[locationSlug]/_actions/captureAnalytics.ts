'use server';

import { PostHog } from 'posthog-node';
import type { LocationSlug } from '~/domain/locations';
import { env } from '~/env';
import { type OrganizationId } from '~/lib/organization';

const posthog = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: env.NEXT_PUBLIC_POSTHOG_HOST,
});

export async function capturePublicLocationVisit(
    machineId: string | undefined,
    organizationId: OrganizationId,
    locationSlug: LocationSlug,
) {
    posthog.capture({
        distinctId: machineId ?? '-- missing machine id --',
        event: 'publicLocationVisit',
        properties: {
            organizationId,
            locationSlug,
        },
    });
}
