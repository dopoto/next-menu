"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { ErrorCard } from "~/app/_components/ErrorCard";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { type ErrorBoundaryException, type ErrorTypeId } from "~/app/_domain/errors";
import { generateErrorId, logException } from "~/app/_utils/error-logger-utils";

export default function ViewPlanError({
  error,
}: {
  error: ErrorBoundaryException;
}) {
  const errorTypeId: ErrorTypeId = "VIEW_PLAN_ERROR";
  const errorClientSideId = generateErrorId();

  useEffect(() => {
    logException(error, errorTypeId, errorClientSideId);
  }, [error, errorClientSideId]);

  return (
    <SplitScreenContainer
      title={`View plan`}
      subtitle="Sorry, could not complete this operation..."
      mainComponent={
        <ErrorCard
          title="An error occurred"
          errorTypeId={errorTypeId}
          errorDigest={error.digest}
          errorClientSideId={errorClientSideId}
        />
      }
    />
  );
}
