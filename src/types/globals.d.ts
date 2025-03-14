export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      tier: string,

      // TODO remove. 
      onboardingComplete: boolean,

      orgName: string,
      currentLocationId: string,
      currentLocationName: string
    }
  }
}