"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { onboardingAddLocation } from "../../actions/onboardingAddLocation";
import { type ReactNode, useState } from "react";

import { cn } from "~/lib/utils";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function AddLocation({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [errors, setErrors] = useState<string[]>();
  const { user } = useUser();
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const res = await onboardingAddLocation(formData);
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
    <div className={cn("flex flex-col gap-6 max-w-[400px]", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add a location</CardTitle>
          <CardDescription>
            {"Enter the name of your restaurant, pub or bar. This can be changed anytime later from your account."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="locationName">Location Name</Label>
                <Input
                  id="locationName"
                  name="locationName"
                  placeholder="My Fancy Restaurant"
                  required
                />
              </div>
              {errors && errors.length > 0 && (
                <div className="text-red-600">
                  {errors.map((err) => (
                    <p key={err}>{err}</p>
                  ))}
                </div>
              )}

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
