"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "~/server/db";

export const completeOnboarding = async (formData: FormData) => {
  const { userId, orgId, orgRole, orgSlug } = await auth();

  if (!userId) {
    return { message: "No Logged In User" };
  }

  const client = await clerkClient();

  let organizationName = "No organization";
  if (orgId) {
    const organization = await client.organizations.getOrganization({
      organizationId: orgId,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    organizationName = organization.name;
  }

  try {
    //await db
    // .cre(images)
    // .where(and(eq(images.id, id), eq(images.userId, user.userId)));

    // analyticsServerClient.capture({
    //   distinctId: user.userId,
    //   event: "delete image",
    //   properties: {
    //     imageId: id,
    //   },
    // });

    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        locationName: formData.get("locationName"),
        menuName: formData.get("menuName"),
      },
    });
    return { message: res.publicMetadata };
  } catch {
    return { error: "There was an error updating the user metadata." };
  }
};
