"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { OverviewCard } from "~/app/_components/OverviewCard";

export const Redirecting = (props: {stripeSessionId: string}) => {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/onboard/add-location?session_id=${props.stripeSessionId}`);
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <OverviewCard
      sections={[
        {
          title: "Done!",
          content: "Payment completed. Redirecting you to the next step...",
        },
      ]}
      variant={"confirmation"}
    />
  );
};
