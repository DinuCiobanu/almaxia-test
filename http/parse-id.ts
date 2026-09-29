import type { Request, Response } from "express";

/**
 * Express path params are always strings. Parses req.params[param] as a
 * positive integer id; on failure, responds 400 and returns undefined -
 * callers must check for that and return early.
 */
export function parseId(req: Request, res: Response, param = "id"): number | undefined {
  const id = Number(req.params[param]);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: `invalid ${param}` });
    return undefined;
  }
  return id;
}
