export const PUBLIC_ERROR_DELIMITER = "|";
type PublicErrorId = `${number}-${string}`;
export type PublicErrorMessage =
  `${PublicErrorId}${typeof PUBLIC_ERROR_DELIMITER}${string}`;

export class AppError extends Error {
  //public readonly publicErrorMessage: PublicErrorMessage;

  constructor({
    message,
    userMessage,
  }: {
    message: string;
    userMessage?: string;
  }) {
    const publicMessageOrDefault = userMessage || "Something went wrong";

    // The only error fields that we can send to the client-side are a string message and a string digest, so
    // ensure that we form a predefined-format string that can be later parsed by our client-side error.tsx:
    const pb: PublicErrorMessage = `${generateErrorId()}${PUBLIC_ERROR_DELIMITER}${publicMessageOrDefault}`;
    super(pb);
    //this.publicErrorMessage = pb;

    // TODO Log error here
    console.log(message);
  }
}

export function generateErrorId(): PublicErrorId {
  const publicErrorId: PublicErrorId = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 6)}`;
  return publicErrorId;
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
//             message: error instanceof Error ? error.message : "Unknown error",
//         });

//         // Add original error stack if available
//         if (error instanceof Error) {
//             appError.stack = error.stack;
//         }

//         throw appError;
//     }
// }
