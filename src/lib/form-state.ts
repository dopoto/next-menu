import { type z } from "zod";
import { type Path, type UseFormReturn } from "react-hook-form";

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

/**
 * Helper function to handle form errors in react-hook-form components
 */
export function handleFormErrors<TSchema extends z.ZodType>(
  form: UseFormReturn<z.infer<TSchema>>,
  formState: FormState<TSchema>,
) {
  if (formState.status === "error") {
    // Clear any existing errors first
    form.clearErrors();

    if (formState.fieldErrors) {
      // Set errors for each field
      Object.entries(formState.fieldErrors).forEach(([field, messages]) => {
        if (messages && messages.length > 0) {
          form.setError(field as Path<z.infer<TSchema>>, {
            message: messages.join(". "),
          });
        }
      });

      // Update form fields with the server-returned values if any
      if (formState.fields) {
        Object.entries(formState.fields).forEach(([field, value]) => {
          form.setValue(
            field as Path<z.infer<TSchema>>,
            value as z.infer<TSchema>[typeof field],
          );
        });
      }
    }

    if (formState.rootError) {
      form.setError("root", {
        message: formState.rootError,
      });
    }
  }
}
