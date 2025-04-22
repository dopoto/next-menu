export {};

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            tier: string;
            orgName: string;
        };
    }
}
