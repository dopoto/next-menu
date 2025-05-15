import { type InferSelectModel } from 'drizzle-orm';
import { z } from 'zod';
import { orders } from '~/server/db/schema';

export type Order = InferSelectModel<typeof orders>;

export const orderIdSchema = z.coerce.string();
export type OrderId = z.infer<typeof orderIdSchema>;
