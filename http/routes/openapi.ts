import express from "express";
import { openApiDocument } from "../../contracts/openapi";

const router = express.Router();

router.get("/openapi.json", (_req, res) => {
  res.json(openApiDocument);
});

export default router;
