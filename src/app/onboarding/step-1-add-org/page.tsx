import * as React from 'react'
import { CreateOrganization } from '@clerk/nextjs'
 

export default function OnboardingPage() { 
  return (
    <div className="flex flex-col flex-nowrap items-center justify-center">      
      <h1>Welcome</h1>
      <CreateOrganization afterCreateOrganizationUrl={'/onboarding/step-2-add-location'} hideSlug={true} />
    </div>
  )
}