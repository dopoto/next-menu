// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from 'drizzle-orm';
import { boolean, decimal, index, integer, pgTableCreator, primaryKey, timestamp, varchar } from 'drizzle-orm/pg-core';
import { MENU_MODES, type MenuModeId } from '~/domain/menu-modes';
import { DeliveryStatusId, deliveryStatusValues } from '~/domain/order-items';
import { CURRENCIES, type CurrencyId } from '../../domain/currencies';

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

const defaultCurrency: CurrencyId = 'USD';
const defaultMenuMode: MenuModeId = 'noninteractive';

export const locations = createTable(
    'location',
    {
        id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
        name: varchar('name', { length: 50 }).notNull().unique(),
        slug: varchar('slug', { length: 50 }).notNull().unique(),
        currencyId: varchar('currency_id', { length: 3 }).notNull().default(defaultCurrency),
        orgId: integer('org_id')
            .notNull()
            .references(() => organizations.id),
        menuMode: varchar('menu_mode', { length: 20 }).notNull().default(defaultMenuMode),
        createdAt: timestamp('created_at', { withTimezone: true })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date()),
    },
    (example) => [
        {
            nameIndex: index('location_name_idx').on(example.name),
            currencyCheck: sql`CHECK (currency_id IN (${sql.join(Object.keys(CURRENCIES))}))`,
            menuModeCheck: sql`CHECK (menu_mode IN (${sql.join(Object.keys(MENU_MODES))}))`,
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
        isPublished: boolean('is_published').default(true).notNull(),
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
        isPublished: boolean('is_published').default(true).notNull(),
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

export const orders = createTable('order', {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    locationId: integer('location_id')
        .notNull()
        .references(() => locations.id),
    createdAt: timestamp('created_at', { withTimezone: true })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date()),
});

const defaultDeliveryStatus: DeliveryStatusId = 'pending';
export const orderItems = createTable(
    'order_item',
    {
        id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
        orderId: integer('order_id')
            .notNull()
            .references(() => orders.id),
        menuItemId: integer('menu_item_id')
            .notNull()
            .references(() => menuItems.id),
        deliveryStatus: varchar('delivery_status', { length: 10 }).notNull().default(defaultDeliveryStatus),
        isPaid: boolean('is_paid').default(false).notNull(),
        createdAt: timestamp('created_at', { withTimezone: true })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date()),
    },
    () => [
        {
            deliveryStatus: sql`CHECK (delivery_status IN (${sql.join([...deliveryStatusValues])}))`,
        },
    ],
);

export const ordersRelations = relations(orders, ({ many }) => ({
    orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
}));
