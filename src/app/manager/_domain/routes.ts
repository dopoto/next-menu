export type AdminRoute = {
  name: string;
  path: string;
  childRoutes?: AdminRoute[];
};

export type BreadcrumbSegment = {
  level: number;
  activeRoute: AdminRoute[];
  siblingRoutes: AdminRoute[];
};

export const routes: AdminRoute[] = [
  {
    name: "Manager",
    path: "/manager",
    childRoutes: [
      {
        name: "Locations",
        path: "/manager/locations",
        childRoutes: [{ name: "Add location", path: "/manager/locations/add" }],
      },
      {
        name: "Another route",
        path: "/manager/another",
        childRoutes: [{ name: "Add another", path: "/manager/another/add" }],
      },
    ],
  },
];

export function findRoute(
  pathname: string,
  routesList: AdminRoute[] = routes,
): AdminRoute | undefined {
  for (const route of routesList) {
    if (route.path === pathname) {
      return route;
    }
    if (route.childRoutes) {
      const foundRoute = findRoute(pathname, route.childRoutes);
      if (foundRoute) {
        return foundRoute;
      }
    }
  }
  return undefined;
}

export function buildBreadcrumbs(pathname: string): BreadcrumbSegment[] {

    return []
}
