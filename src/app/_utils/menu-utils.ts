import { type UserRouteFn } from "~/lib/routes";
import { type LocationId } from "~/app/u/[locationId]/_domain/locations";
import { type MENU_TREE } from "~/lib/nav";

export function findMenuItemByPath(
  node: typeof MENU_TREE,
  pathname: string,
  locationId: LocationId,
): typeof MENU_TREE | undefined {
  if (node.route) {
    const itemFn = node.route as UserRouteFn;
    if (itemFn(locationId) === pathname) {
      return node;
    }
  }

  if (node.children) {
    for (const child of node.children) {
      const found = findMenuItemByPath(child, pathname, locationId);
      if (found) return found;
    }
  }

  return undefined;
}

export function getBreadcrumbPath(
  tree: typeof MENU_TREE,
  targetId: string,
  path: (typeof MENU_TREE)[] = [],
): (typeof MENU_TREE)[] {
  if (tree.id === targetId) {
    return [...path, tree];
  }

  if (tree.children) {
    for (const child of tree.children) {
      const found = getBreadcrumbPath(child, targetId, [...path, tree]);
      if (found.length > 0) return found;
    }
  }

  return [];
}
