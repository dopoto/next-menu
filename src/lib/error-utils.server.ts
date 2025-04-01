import * as Sentry from "@sentry/nextjs";
import {
  PUBLIC_ERROR_DELIMITER,
  type PublicErrorId,
  type PublicErrorMessage,
} from "~/domain/error-handling";
import { env } from "~/env";

export class AppError extends Error {
  public readonly publicErrorId: PublicErrorId;
  public readonly publicMessage: string;
  public digest: string;
  constructor({
    error,
    internalMessage,
    publicMessage,
  }: {
    error?: unknown;
    internalMessage?: string;
    publicMessage?: string;
  }) {
    const publicErrorId = generateErrorId();
    const publicMessageOrDefault = publicMessage ?? "Something went wrong";

    // The only error fields that we can send to the client-side are a string message and a string digest, so
    // ensure that we form a predefined-format string that can be later parsed by our client-side error.tsx:
    const pb: PublicErrorMessage = `${publicErrorId}${PUBLIC_ERROR_DELIMITER}${publicMessageOrDefault}`;

    super(pb);

    this.digest = pb;
    this.publicErrorId = publicErrorId;
    this.publicMessage = publicMessageOrDefault;

    logException(error, publicErrorId, internalMessage);
  }
}

export function generateErrorId(): PublicErrorId {
  const publicErrorId: PublicErrorId = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 6)}`;
  return publicErrorId;
}

export function logException(
  error: unknown,
  errorClientSideId: string,
  internalMessage?: string,
) {
  if (env.NEXT_PUBLIC_LOG_TO_CONSOLE) {
    const errorString = `[APP_ERROR] 
      ${errorClientSideId}
      ${internalMessage}
      ${error?.toString()}`;
    console.error(errorString);
  }

  if (env.NEXT_PUBLIC_LOG_TO_SENTRY) {
    Sentry.withScope((scope) => {
      scope.setTag("errorClientSideId", errorClientSideId);
      if (internalMessage) {
        scope.setTag("internalMessage", internalMessage);
      }
      Sentry.captureException(error);
    });
  }
}

// Helper function to wrap server functions
// export async function withErrorHandling<T>(fn: () => Promise<T>): Promise<T> {
//     try {
//         return await fn();
//     } catch (error) {
//         if (error instanceof AppError) {
//             throw error; // Already processed
//         }

//         // Convert unknown errors to AppError
//         const appError = new AppError({
//             internalMessage: error instanceof Error ? error.message : "Unknown error",
//         });

//         // Add original error stack if available
//         if (error instanceof Error) {
//             appError.stack = error.stack;
//         }

//         throw appError;
//     }
// }
