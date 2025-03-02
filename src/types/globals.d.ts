export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      tier: PriceTierId,
      onboardingComplete: boolean,
      orgName: string,
      currentLocationId: string,
      currentLocationName: string
    }
  }
}