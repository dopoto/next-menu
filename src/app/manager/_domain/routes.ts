type Route = {
    name: string;
    segment: string;
    childRoutes?: Route[]
}

export const routes: Route[] = [
    { name: "Locations", segment: "/manager/locations" },    
]