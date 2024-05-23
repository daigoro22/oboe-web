import { beforeAll, describe, expect, test } from "vitest";
import { AnkiSessionFakeRepository } from "@/lib/test-helper/ankiSession";
import { createMiddleware } from "hono/factory";
import { container } from "tsyringe";
import { ankiSession } from "./ankiSession.controller";
import { Hono } from "hono";
import { testClient } from "hono/testing";
import { setFakeUserMiddleware } from "@/lib/test-helper";
import { verifySignupMiddleware } from "@/lib/middleware";

const ankiSessionContainerMiddleware = createMiddleware(async (c, next) => {
  container.register("IAnkiSession", {
    useValue: new AnkiSessionFakeRepository(),
  });
  await next();
});

describe("ankiSession.controller", () => {
  const app = new Hono({ strict: false });
  app.use("*", setFakeUserMiddleware);
  app.use("*", verifySignupMiddleware);
  app.use("*", ankiSessionContainerMiddleware);
  app.route("/", ankiSession);
  const client = testClient<typeof ankiSession>(app);

  test("通常ケース", async () => {
    const res = await client.api.auth.verified.ankiSession.latest.$get();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      point: 100,
      session: {
        id: 1,
        deckId: "1",
        startsAt: null,
        endsAt: null,
        userId: "1",
        createdAt: new Date().toISOString(),
      },
    });
  });
});
