import type { Response } from "express";
import type { z, ZodType } from "zod";

/**
 * The wire contract's `string` fields are often `Date` on the domain side
 * (JSON.stringify serializes Date -> ISO string); this allows exactly that
 * substitution, recursively, while still requiring everything else -
 * including nesting/shape - to match the contract exactly.
 */
type Serializable<T> = T extends string
  ? string | Date
  : T extends (infer U)[]
    ? Serializable<U>[]
    : T extends object
      ? { [K in keyof T]: Serializable<T[K]> }
      : T;

/**
 * Sends `data` as JSON, typed against the contract's response schema and
 * validated at runtime before it goes out. A handler that starts returning
 * a shape the contract doesn't describe fails here - either at compile
 * time (data doesn't satisfy Serializable<z.infer<Schema>>) or, if that
 * was bypassed with an `as`, at request time when schema.parse throws.
 *
 * JSON.parse(JSON.stringify(data)) mirrors what res.json() actually sends
 * over the wire, so the schema validates the real wire shape, not the
 * in-memory domain object.
 */
export function respond<Schema extends ZodType>(
  res: Response,
  schema: Schema,
  data: Serializable<z.infer<Schema>>,
  status = 200,
): void {
  const wireData = JSON.parse(JSON.stringify(data));
  res.status(status).json(schema.parse(wireData));
}
