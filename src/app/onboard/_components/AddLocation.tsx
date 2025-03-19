"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { onboardingAddLocation } from "../../actions/onboardingAddLocation";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { type PriceTierId } from "~/app/_domain/price-tiers";
import { OverviewCard } from "~/app/_components/OverviewCard";

export const AddLocation = ({
  priceTierId,
  stripeSessionId,
  className,
}: {
  priceTierId: PriceTierId;
  stripeSessionId?: string;
  className?: string;
}) => {
  const [errors, setErrors] = useState<string[]>();
  const { user } = useUser();
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const res = await onboardingAddLocation(formData);
    if (res?.message) {
      // Reloads the user's data from the Clerk API
      await user?.reload();

      const nextStepRoute =  stripeSessionId
      ? `/onboard/overview?session_id=${ stripeSessionId}`
      : `/onboard/overview`;

      router.push(nextStepRoute);
    }
    if (res?.errors) {
      setErrors(res?.errors);
    }
  };

  return (
    <div className={cn("flex w-full flex-col gap-6", className)}>
      <OverviewCard
        title={"Add a location"}
        subtitle={`This can be changed anytime later from your account.`}
        sections={[
          {
            title: "",
            content: (
              <form action={handleSubmit}>
                <input type="hidden" name="priceTierId" value={priceTierId} />
                <input
                  type="hidden"
                  name="stripeSessionId"
                  value={stripeSessionId}
                />
                <div className="flex flex-col gap-6 w-full mt-6">
                  <div className="grid gap-2">
                    <Label htmlFor="locationName">The name of your restaurant, pub or bar</Label>
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
            ),
          },
        ]}
        variant={"neutral"}
      />
    </div>
  );
  /*
  return (
    <div className={cn("flex w-full flex-col gap-6", className)}>
      <p className="max-w-[400px] text-sm">
        Enter the name of your restaurant, pub or bar. This can be changed
        anytime later from your account.
      </p>
      <Card className="w-full">
        <CardContent>
          <form action={handleSubmit}>
            <input type="hidden" name="priceTierId" value={priceTierId} />
            <input
              type="hidden"
              name="stripeSessionId"
              value={stripeSessionId}
            />
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
  */
};
