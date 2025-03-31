"use client"; // Error boundaries must be Client Components

import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { ErrorCard } from "../_components/ErrorCard";
import { type PublicError } from "~/domain/error-handling";

export default function OnboardError({
  error,
  reset,
}: {
  error: PublicError;
  reset: () => void;
}) {
  return (
    <SplitScreenContainer
      title={`Onboarding`}
      subtitle="Sorry, could not complete this operation..."
      mainComponent={
        <ErrorCard
          publicErrorMessage={error.digest}
          errorDigest={error.digest}
          onReset={reset}
        />
      }
    />
  );
}
