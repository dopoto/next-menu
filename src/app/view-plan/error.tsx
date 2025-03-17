"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { SplitScreenContainer } from "~/app/_components/SplitScreenContainer";
import { ErrorCard } from "../_components/ErrorCard";
import { generateErrorId, logException } from "../_utils/error-logger-utils";
import {
  type ErrorTypeId,
  type ErrorBoundaryException,
} from "../_domain/errors";

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
