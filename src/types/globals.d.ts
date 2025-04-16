export {};

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            tier: string;
            orgName: string;
            currentLocationId: string;
            currentLocationName: string;
        };
    }
}
