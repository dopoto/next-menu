'use client';

import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { completeOnboarding } from '../actions/completeOnboarding'
import { PublicTopNav } from '../_components/PublicTopNav';
 

export default function OnboardingComponent() {
  const [error, setError] = React.useState('')
  const { user } = useUser()
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    const res = await completeOnboarding(formData)
    console.log(`DBG ${JSON.stringify(res)}`)
    if (res?.message) {
      // Reloads the user's data from the Clerk API
      await user?.reload()
      router.push('/dashboard')
    }
    if (res?.error) {
      setError(res?.error)
    }
  }
  return (
    <div className="flex flex-col flex-nowrap items-center justify-center">
      <PublicTopNav />
      <h1>Welcome</h1>
      <form action={handleSubmit}>
        <div>
          <label>Location Name</label>
          <p>Enter the name of your first location.</p>
          <input type="text" name="locationName" required />
        </div>

        <div>
          <label>Menu Name</label>
          <p>Describe the name of your first location.</p>
          <input type="text" name="menuName" required />
        </div>
        {error && <p className="text-red-600">Error: {error}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}