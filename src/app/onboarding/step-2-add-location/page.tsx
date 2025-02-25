"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { onboardingAddLocation } from "../../actions/onboardingAddLocation";
import { useState } from "react";

export default function OnboardingPage() {
  const [errors, setErrors] = useState<string[]>();
  const { user } = useUser();
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const res = await onboardingAddLocation(formData);
    console.log(`DBG ${JSON.stringify(res)}`);
    if (res?.message) {
      // Reloads the user's data from the Clerk API
      await user?.reload();
      router.push("/onboarded");
    }
    if (res?.errors) {
      setErrors(res?.errors);
    }
  };
  return (
    <div className="flex flex-col flex-nowrap items-center justify-center">
      <h1>Welcome</h1>

      <form action={handleSubmit}>
        <div>
          <label>Location Name</label>
          <p>Enter the name of your first location.</p>
          <input type="text" name="locationName" required />
        </div>

        {errors && errors.length > 0 && (
          <div className="text-red-600">
            Errors:
            {errors.map((err) => (
              <p key={err}>{err}</p>
            ))}
          </div>
        )}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
