"use client"; // Error boundaries must be Client Components
import { ErrorCard } from "~/app/_components/ErrorCard";
import { type PublicError } from "~/domain/error-handling";

export default function ManageError({
  error,
  reset,
}: {
  error: PublicError;
  reset: () => void;
}) {
  return (
    <ErrorCard
      publicErrorMessage={error.digest}
      errorDigest={error.digest}
      onReset={reset}
    />
  );
}
