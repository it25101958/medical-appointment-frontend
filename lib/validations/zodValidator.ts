import { z, ZodTypeAny } from "zod";

export const zodValidator = (schema: ZodTypeAny) => (value: unknown) => {
  const fieldValue =
    typeof value === "object" && value !== null ? (value as any).value : value;

  const result = schema.safeParse(fieldValue);
  if (!result.success) return result.error.errors[0]?.message;
  return undefined;
};
