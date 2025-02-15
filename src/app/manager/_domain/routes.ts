export type AdminRoute = {
  name: string;
  path: string;
  childRoutes?: AdminRoute[];
};

export type BreadcrumbSegment = {
  level: number;
  activeRoute: AdminRoute;
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
  const segments: BreadcrumbSegment[] = [];
  const pathParts = pathname.split("/").filter((part) => part !== "");

  let currentPath = "";
  let currentRoutes = routes;

  for (let i = 0; i < pathParts.length; i++) {
    currentPath += `/${pathParts[i]}`;
    const activeRoute = findRoute(currentPath, currentRoutes);

    if (activeRoute) {
      let siblingRoutes: AdminRoute[] = [];
      if (i > 0) {
        // Find the parent route to get sibling routes
        const parentPath = currentPath.substring(
          0,
          currentPath.lastIndexOf("/"),
        );
        const parentRoute = findRoute(parentPath);
        if (parentRoute?.childRoutes) {
          siblingRoutes = parentRoute.childRoutes.filter(
            (route) => route.path !== activeRoute.path,
          );
        }
      } else {
        siblingRoutes = routes.filter(route => route.path !== activeRoute.path)
      }

      segments.push({
        level: i,
        activeRoute,
        siblingRoutes,
      });

      if (activeRoute.childRoutes) {
        currentRoutes = activeRoute.childRoutes;
      } else {
        currentRoutes = [];
      }
    }
  }

  return segments;
}
