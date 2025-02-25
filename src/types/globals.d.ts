export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete: boolean,
      orgName: string,
      currentLocationId: string,
      currentLocationName: string
    }
  }
}