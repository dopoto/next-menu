import type { InferSelectModel } from 'drizzle-orm';
import { atom } from 'jotai';
import { type menuItems } from '~/server/db/schema';

export const menuItemsAtom = atom<Map<number, InferSelectModel<typeof menuItems>>>(new Map());
menuItemsAtom.debugLabel = 'menuItemsAtom';
