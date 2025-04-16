export const PUBLIC_ERROR_DELIMITER = '|';
export type PublicErrorId = `${number}-${string}`;
export type PublicErrorMessage = `${PublicErrorId}${typeof PUBLIC_ERROR_DELIMITER}${string}`;

/**
 * In production builds, Next.js strips server-side errors before sending them to the client. All
 * error messages are replaced with this generic one:
 *
 * "An error occurred in the Server Components render. The specific message is omitted in production
 * builds to avoid leaking sensitive details. A digest property is included on this error instance which
 * may provide additional details about the nature of the error.".
 *
 * Therefore, in order to present a user-friendly message and an error reference ID to the users, we need
 * to hijack the `digest` field, so we can get the user-friendly error data to the client-side error.tsx,
 * where we then parse it.
 */
export type PublicError = Error & {
    digest?: PublicErrorMessage;
};
