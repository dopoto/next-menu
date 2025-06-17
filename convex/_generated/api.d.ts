/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as locations from "../locations.js";
import type * as menuItems from "../menuItems.js";
import type * as menuItemsToMenus from "../menuItemsToMenus.js";
import type * as menus from "../menus.js";
import type * as orderItems from "../orderItems.js";
import type * as orders from "../orders.js";
import type * as validators from "../validators.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  locations: typeof locations;
  menuItems: typeof menuItems;
  menuItemsToMenus: typeof menuItemsToMenus;
  menus: typeof menus;
  orderItems: typeof orderItems;
  orders: typeof orders;
  validators: typeof validators;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
