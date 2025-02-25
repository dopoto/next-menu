"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { db } from "~/server/db";
import { locations } from "~/server/db/schema";

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
});

export const onboardingAddLocation = async (formData: FormData) => {
  const { userId, orgId, orgRole, orgSlug } = await auth();

  // TODO Validate user role

  if (!userId) {
    return { errors: ["You must be authenticated."] };
  }

  const validatedFormFields = formDataSchema.safeParse({
    locationName: formData.get("locationName"),
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

  try {
    const [insertedLocation] = await db
      .insert(locations)
      .values({
        name: validatedFormFields.data.locationName,
        orgId,
      })
      .returning({ id: locations.id });

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
        onboardingComplete: true,
        orgName,
        currentLocationId: insertedLocation?.id.toString() ?? "",
        currentLocationName: validatedFormFields.data.locationName,
      },
    };
    const res = await client.users.updateUser(userId, {
      publicMetadata: customJwtSessionClaims.metadata,
    });
    return { message: res.publicMetadata };
  } catch {
    // TODO log error
    return { errors: ["There was an error updating the user metadata."] };
  }
};
