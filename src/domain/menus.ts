import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { menus } from "~/server/db/schema";

export type Menu = InferSelectModel<typeof menus>;
export type NewMenu = InferInsertModel<typeof menus>;