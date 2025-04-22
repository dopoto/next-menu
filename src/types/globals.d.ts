export {};

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            tier: string;
            orgName: string;
            /**
             * The id of the location created during onboarding. Should be used as
             * 'known good location' - a fallback to redirect the user to if needed.
             * Should not be deletable.
             */
            initialLocationId: string;
        };
    }
}
