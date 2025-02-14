import { auth } from "@clerk/nextjs/server";
import "server-only";
import { db } from "~/server/db";

export async function getLocations() {
  const items = await db.query.locations.findMany({
    orderBy: (model, { desc }) => desc(model.name),
  });
  return items;
}
export async function getMyLocations() {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  console.log("user", user);

  const items = await db.query.locations.findMany({
    where: (model, {eq}) => eq(model.userId, user.userId),
    orderBy: (model, { desc }) => desc(model.name),
  });
  return items;
}
