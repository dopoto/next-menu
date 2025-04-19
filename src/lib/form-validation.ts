/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { type ZodTypeAny } from 'zod';

/**
 * Custom helper to safely attach meta with TS support to Zod schemas.
 */
export function withMeta<T extends ZodTypeAny>(schema: T, meta: Record<string, any>): T {
    (schema as any)._def.meta = meta;
    return schema;
}
