import { auth } from "@clerk/nextjs/server";
import "server-only";
import { type LocationId } from "~/app/_domain/location";
import { db } from "~/server/db";

export async function getLocations() {
  const items = await db.query.locations.findMany({
    orderBy: (model, { desc }) => desc(model.name),
  });
  return items;
}

export async function getMenusByLocation(locationId: LocationId) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  console.log("user", user);

  // const items = await db.query.locations.findMany({
  //   where: (model, { eq }) => eq(model.userId, user.userId),
  //   orderBy: (model, { desc }) => desc(model.name),
  // });
  const items = await Promise.resolve([
    //{ name: `menu 1 for location ${locationId}` },
  ]);
  return items;
}

export async function getLocation(id: number) {
  const item = await db.query.locations.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!item) throw new Error("Not found");

  return item;
}
