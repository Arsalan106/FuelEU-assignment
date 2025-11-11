import request from "supertest";
import { createApp } from "../../src/infrastructure/server/app.js";

describe("HTTP", () => {
  const app = createApp();

  it("health", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
  });
});
