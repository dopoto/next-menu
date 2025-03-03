export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      tier: string,
      onboardingComplete: boolean,
      orgName: string,
      currentLocationId: string,
      currentLocationName: string
    }
  }
}