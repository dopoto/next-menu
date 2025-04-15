import { z } from "zod";

/**
 * Generic type for field-level validation errors
 * TSchema is a Zod schema that defines the form's shape
 */
export type FieldErrors<TSchema extends z.ZodType> = {
  [K in keyof z.infer<TSchema>]?: string[];
};

type SuccessResult = {
  status: "success";
};

type ErrorResult<TSchema extends z.ZodType> = {
  status: "error";
  fields?: Partial<z.infer<TSchema>>;
  fieldErrors?: FieldErrors<TSchema>;
  rootError?: string;
};

/**
 * Generic form state type that works with any Zod schema
 * TSchema is a Zod schema that defines the form's shape
 */
export type FormState<TSchema extends z.ZodType> =
  | SuccessResult
  | ErrorResult<TSchema>;

/**
 * Helper function to process Zod validation errors into field errors
 */
export function processFormErrors<TSchema extends z.ZodType>(
  error: z.ZodError,
  data: Partial<z.infer<TSchema>>,
): FormState<TSchema> {
  const fields: Partial<z.infer<TSchema>> = {};
  const fieldErrors: FieldErrors<TSchema> = {};

  // Group validation errors by field
  error.issues.forEach((issue) => {
    const field = issue.path[0]?.toString() as keyof z.infer<TSchema>;
    if (field) {
      if (!fieldErrors[field]) {
        fieldErrors[field] = [];
      }
      fieldErrors[field]!.push(issue.message);
    }
  });

  // Collect submitted field values
  Object.keys(data).forEach((key) => {
    fields[key as keyof z.infer<TSchema>] = data[key as keyof typeof data];
  });

  return {
    status: "error",
    fields,
    fieldErrors,
  };
}
