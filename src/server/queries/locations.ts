import { eq } from 'drizzle-orm';
import { type LocationId } from '~/domain/locations';
import { AppError } from '~/lib/errors';
import { db } from '~/server/db';
import { locations } from '~/server/db/schema';

export async function getLocation(locationId: LocationId) {
    const location = await db.query.locations.findFirst({
        where: eq(locations.id, locationId),
    });

    if (!location) {
        throw new AppError({ internalMessage: 'Location not found' });
    }

    return location;
}
