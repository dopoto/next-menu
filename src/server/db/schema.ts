// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from 'drizzle-orm';
import { boolean, decimal, index, integer, pgTableCreator, primaryKey, timestamp, varchar } from 'drizzle-orm/pg-core';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `next-menu_${name}`);

export const organizations = createTable('organization', {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    clerkOrgId: varchar('clerk_org_id', { length: 256 }).notNull().unique(),
    stripeCustomerId: varchar('stripe_customer_id', { length: 256 }),
    createdAt: timestamp('created_at', { withTimezone: true })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date()),
});

export const users = createTable(
    'user',
    {
        id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
        role: varchar('role', { length: 10 }).notNull(),
        clerkUserId: varchar('clerk_user_id', { length: 256 }).notNull(),
        orgId: integer('org_id')
            .notNull()
            .references(() => organizations.id),
        createdAt: timestamp('created_at', { withTimezone: true })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date()),
    },
    () => [{ roleCheck: sql`CHECK (role IN ('orgowner', 'admin', 'user'))` }],
);

export const locations = createTable(
    'location',
    {
        id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
        name: varchar('name', { length: 50 }).notNull().unique(),
        slug: varchar('slug', { length: 50 }).notNull().unique(),
        orgId: integer('org_id')
            .notNull()
            .references(() => organizations.id),
        createdAt: timestamp('created_at', { withTimezone: true })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date()),
    },
    (example) => [
        {
            nameIndex: index('location_name_idx').on(example.name),
        },
    ],
);

export const menus = createTable(
    'menu',
    {
        id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
        name: varchar('name', { length: 256 }),
        locationId: integer('location_id')
            .notNull()
            .references(() => locations.id),
        createdAt: timestamp('created_at', { withTimezone: true })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date()),
    },
    (example) => [
        {
            nameIndex: index('menu_name_idx').on(example.name),
        },
    ],
);

export const menuItems = createTable(
    'menu_item',
    {
        id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
        locationId: integer('location_id')
            .notNull()
            .references(() => locations.id),
        name: varchar('name', { length: 256 }),
        description: varchar('description', { length: 256 }),
        price: decimal('price').notNull(),
        type: varchar('type', { length: 10 }).notNull().default('dish'),
        isNew: boolean('is_new').default(false).notNull(),
        createdAt: timestamp('created_at', { withTimezone: true })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date()),
    },
    (example) => [
        {
            nameIndex: index('menu_item_name_idx').on(example.name),
            typeCheck: sql`CHECK (type IN ('dish', 'beverage'))`,
        },
    ],
);

export const menuItemsToMenus = createTable(
    'menu_items_to_menus',
    {
        menuId: integer('menu_id')
            .notNull()
            .references(() => menus.id),
        menuItemId: integer('menu_item_id')
            .notNull()
            .references(() => menuItems.id),
        sortOrderIndex: integer('sort_order_index').notNull().default(0),
        createdAt: timestamp('created_at', { withTimezone: true })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date()),
    },
    (table) => [
        index('menu_items_to_menus_menu_item_idx').on(table.menuItemId),
        index('menu_items_to_menus_menu_idx').on(table.menuId),
        primaryKey({ columns: [table.menuId, table.menuItemId] }),
    ],
);
