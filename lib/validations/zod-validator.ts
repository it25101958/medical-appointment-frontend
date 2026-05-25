import { ZodTypeAny, ZodError } from "zod";

export const zodValidator =
  (schema: ZodTypeAny) =>
  (input: unknown): string | undefined => {
    const value =
      input && typeof input === "object" && "value" in input
        ? (input as { value?: unknown }).value
        : input;

    try {
      schema.parse(value);
      return undefined;
    } catch (err) {
      if (err instanceof ZodError) {
        return err.issues?.[0]?.message;
      }
      return "Invalid input";
    }
  };
