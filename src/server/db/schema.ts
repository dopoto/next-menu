// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  pgTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `next-menu_${name}`);

export const customers = createTable("customer", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  /**
   * @example 'user_...'
   */
  clerkUserId: varchar("clerk_user_id", { length: 256 }).notNull(),
  orgId: varchar("org_id", { length: 256 }).notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 256 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const locations = createTable(
  "location",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 50 }),
    slug: varchar("slug", { length: 50 }),
    orgId: varchar("org_id", { length: 256 })
      .notNull()
      .references(() => customers.orgId),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    nameIndex: index("location_name_idx").on(example.name),
  }),
);

export const menus = createTable(
  "menu",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }),
    locationId: integer("location_id")
      .notNull()
      .references(() => locations.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    nameIndex: index("menu_name_idx").on(example.name),
  }),
);

export const menuItems = createTable(
  "menu_item",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    locationId: integer("location_id")
      .notNull()
      .references(() => locations.id),
    name: varchar("name", { length: 256 }),
    description: varchar("description", { length: 256 }),
    price: decimal("price").notNull(),
    isNew: boolean("is_new").default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    nameIndex: index("menu_item_name_idx").on(example.name),
  }),
);

// Type definitions TODO move from here

export type Location = InferSelectModel<typeof locations>;
export type NewLocation = InferInsertModel<typeof locations>;

export type Menu = InferSelectModel<typeof menus>;
export type NewMenu = InferInsertModel<typeof menus>;
