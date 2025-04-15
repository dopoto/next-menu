import { z } from "zod";

/**
 * Generic type for field-level validation errors
 * TSchema is a Zod schema that defines the form's shape
 */
export type FieldErrors<TSchema extends z.ZodType> = {
  [K in keyof z.infer<TSchema>]?: string[];
};

/**
 * Generic form state type that works with any Zod schema
 * TSchema is a Zod schema that defines the form's shape
 */
export type FormState<TSchema extends z.ZodType> = {
  status: "success" | "error";
  fields?: Partial<z.infer<TSchema>>;
  fieldErrors?: FieldErrors<TSchema>;
  rootError?: string;
};

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
    const field = issue.path[0]?.toString();
    if (field) {
      if (!fieldErrors[field as keyof z.infer<TSchema>]) {
        fieldErrors[field as keyof z.infer<TSchema>] = [];
      }
      fieldErrors[field as keyof z.infer<TSchema>]!.push(issue.message);
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
