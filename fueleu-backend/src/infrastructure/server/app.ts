import express from "express";
import dotenv from "dotenv";
import { routesRouter } from "../../adapters/inbound/http/routes.routes.js";
import { complianceRouter } from "../../adapters/inbound/http/compliance.routes.js";
import { bankingRouter } from "../../adapters/inbound/http/banking.routes.js";
import { poolsRouter } from "../../adapters/inbound/http/pools.routes.js";
//@ts-ignore
import cors from "cors";
dotenv.config();

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
  app.use("/routes", routesRouter);
  app.use("/compliance", complianceRouter);
  app.use("/banking", bankingRouter);
  app.use("/pools", poolsRouter);

  app.get("/health", (_req, res) => res.json({ ok: true }));
  return app;
}
