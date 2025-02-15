"use client";

import { useToast } from "~/hooks/use-toast";

export function SomeTopNavBtn() {
  const { toast } = useToast();
  return (
    <button
    className="cursor-pointer"
      onClick={() => {
        toast({
          title: "Scheduled: Catch up",
          description: "Friday, February 10, 2023 at 5:57 PM",
        });
      }}
    >
      Show Toast
    </button>
  );
}
