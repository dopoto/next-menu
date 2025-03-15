"use client"; // Error boundaries must be Client Components
import { useEffect } from "react";
import { ErrorCard } from "~/app/_components/ErrorCard";
import {
  type ErrorBoundaryException,
  type ErrorTypeId,
} from "~/app/_domain/errors";
import { generateErrorId, logException } from "~/app/_utils/error-logger-utils";

export default function ManageError({
  error,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  reset,
}: {
  error: ErrorBoundaryException;
  reset: () => void;
}) {
  const errorTypeId: ErrorTypeId = "CHANGE_PLAN_ERROR";
  const errorClientSideId = generateErrorId();

  useEffect(() => {
    logException(error, errorTypeId, errorClientSideId);
  }, [error, errorClientSideId]);

  return (
    <ErrorCard
      title="An error occurred"
      errorTypeId={errorTypeId}
      errorDigest={error.digest}
      errorClientSideId={errorClientSideId}
    />
  );
}
