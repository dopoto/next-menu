import { type LocationSlug } from '~/domain/locations';
import { type NAV_TREE } from '~/domain/nav';
import { type UserRouteFn } from '~/lib/routes';

export function findNavItemByPath(
    node: typeof NAV_TREE,
    pathname: string,
    locationSlug: LocationSlug,
): typeof NAV_TREE | undefined {
    if (node.route) {
        const itemFn = node.route as UserRouteFn;
        if (itemFn(locationSlug) === pathname) {
            return node;
        }
    }

    if (node.children) {
        for (const child of node.children) {
            const found = findNavItemByPath(child, pathname, locationSlug);
            if (found) return found;
        }
    }

    return undefined;
}

export function getBreadcrumbPath(
    tree: typeof NAV_TREE,
    targetId: string,
    path: (typeof NAV_TREE)[] = [],
): (typeof NAV_TREE)[] {
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
