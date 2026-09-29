/**
 * Builds an OpenAPI 3.1 document from the API contract (api.ts). OpenAPI
 * 3.1 uses JSON Schema (2020-12) natively for its `schema` fields, and Zod
 * v4 ships z.toJSONSchema() out of the box - so this needs no extra
 * dependency, just a walk over the route table.
 */
import { z } from "zod";
import { API } from "./api";

function toOpenApiPath(path: string): string {
  return path.replace(/:([a-zA-Z0-9_]+)/g, "{$1}");
}

function pathParameters(path: string) {
  return [...path.matchAll(/:([a-zA-Z0-9_]+)/g)].map((match) => ({
    name: match[1],
    in: "path",
    required: true,
    schema: { type: "string" },
  }));
}

type PathItem = Record<string, unknown>;

const paths: Record<string, PathItem> = {};

for (const definition of Object.values(API)) {
  const openApiPath = toOpenApiPath(definition.path);
  const method = definition.method.toLowerCase();
  const successStatus = definition.method === "POST" ? "201" : "200";

  paths[openApiPath] ??= {};
  paths[openApiPath][method] = {
    parameters: pathParameters(definition.path),
    ...("request" in definition
      ? {
          requestBody: {
            required: true,
            content: { "application/json": { schema: z.toJSONSchema(definition.request) } },
          },
        }
      : {}),
    responses: {
      [successStatus]: {
        description: "OK",
        content: { "application/json": { schema: z.toJSONSchema(definition.response) } },
      },
    },
  };
}

export const openApiDocument = {
  openapi: "3.1.0",
  info: { title: "almaxia-test API", version: "1.0.0" },
  paths,
};
