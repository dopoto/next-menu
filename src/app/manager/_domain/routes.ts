type Route = {
  name: string;
  path: string;
  childRoutes?: Route[];
};

export const routes: Route[] = [
  {
    name: "Manager",
    path: "/manager",
    childRoutes: [
      {
        name: "Locations",
        path: "/manager/locations",
        childRoutes: [
          { name: "Add location", path: "/manager/locations/add" },
        ],
      },
      {
        name: "Another route",
        path: "/manager/another",
        childRoutes: [
          { name: "Add another", path: "/manager/another/add" },
        ],
      },
    ],
  },
];
