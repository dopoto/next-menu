import { UserRouteFn } from "~/app/_domain/routes";
import { LocationId } from "~/app/u/[locationId]/_domain/locations";
import { menuTree } from "~/app/u/[locationId]/_domain/menu-sections";

export function findMenuItemByPath(
  node: typeof menuTree,
  pathname: string,
  locationId: LocationId,
): typeof menuTree | undefined {
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
  tree: typeof menuTree,
  targetId: string,
  path: (typeof menuTree)[] = [],
): (typeof menuTree)[] {
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
