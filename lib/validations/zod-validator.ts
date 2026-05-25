import { ZodTypeAny, ZodError } from "zod";

export const zodValidator =
  (schema: ZodTypeAny) =>
  (value: unknown): string | undefined => {
    const val = typeof value === "string" ? value : String(value ?? "");

    try {
      schema.parse(val);
      return undefined;
    } catch (err) {
      if (err instanceof ZodError) {
        return err.errors?.[0]?.message;
      }
      return "Invalid input";
    }
  };
