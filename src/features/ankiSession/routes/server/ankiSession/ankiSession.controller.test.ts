import { describe, expect, test, vi } from "vitest";
import {
  AnkiSessionFakeRepository,
  TEST_SESSION_AND_DECK,
} from "@/lib/test-helper/ankiSession";
import { createMiddleware } from "hono/factory";
import { container } from "tsyringe";
import { ankiSession } from "./ankiSession.controller";
import { Hono } from "hono";
import { testClient } from "hono/testing";
import { setFakeUserMiddleware } from "@/lib/test-helper";
import { verifySignupMiddleware } from "@/lib/middleware";
import { faker } from "@/db/faker";
import AnkiSessionService, {
  InsufficientPointError,
} from "@/features/ankiSession/routes/server/ankiSession/ankiSession.service";

const ankiSessionContainerMiddleware = createMiddleware(async (c, next) => {
  container.register("IAnkiSession", {
    useValue: new AnkiSessionFakeRepository(),
  });
  await next();
});

const app = new Hono({ strict: false });
app.use("*", setFakeUserMiddleware);
app.use("*", verifySignupMiddleware);
app.use("*", ankiSessionContainerMiddleware);
app.route("/", ankiSession);
const client = testClient<typeof ankiSession>(app);

describe("latest:GET", () => {
  test("通常ケース", async () => {
    const res = await client.api.auth.verified.ankiSession.latest.$get();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      point: 100,
      session: {
        id: 1,
        deckId: "1",
        deckPublicId: "test_deck",
        startsAt: null,
        endsAt: null,
        userId: 1,
        createdAt: new Date().toISOString(),
        publicId: "test_session",
        isResumable: 1,
        resumeCount: 0,
      },
    });
  });
});

describe("new:POST", () => {
  test("通常ケース", async () => {
    const res = await client.api.auth.verified.ankiSession.new.$post({
      json: {
        deckId: faker.string.nanoid(),
      },
    });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data).toEqual({ sessionId: expect.any(String) });
  });

  test("不正な deckPublicId のエラーケース", async () => {
    const invalidData = { deckId: "" }; // 不正なデータ
    const res = await client.api.auth.verified.ankiSession.new.$post({
      json: invalidData,
    });
    expect(res.status).toBe(400);
  });

  test("ポイントが足りないエラーケース", async () => {
    const insufficientData = { deckId: faker.string.nanoid() };
    const spy = vi
      .spyOn(AnkiSessionService.prototype, "startSession")
      .mockImplementation(async () => {
        throw new InsufficientPointError("所持ポイントが足りません");
      });
    const res = await client.api.auth.verified.ankiSession.new.$post({
      json: insufficientData,
    });
    expect(res.status).toBe(409);
    const jsonResponse = await res.json();
    expect(jsonResponse).toEqual({ error: "所持ポイントが足りません" });
    spy.mockRestore();
  });
});

describe("id:GET", () => {
  test("通常ケース", async () => {
    const res = await client.api.auth.verified.ankiSession[":id"].$get({
      param: { id: "test_session" },
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    const {
      session: { id: _, ...session },
      deck: { id: __, ...deck },
      cards,
    } = TEST_SESSION_AND_DECK;

    expect(data).toEqual({
      session: {
        ...session,
        createdAt: session.createdAt.toISOString(),
        startsAt: session.startsAt ? session.startsAt.toISOString() : null,
        endsAt: session.endsAt ? session.endsAt.toISOString() : null,
      },
      deck: {
        ...deck,
        createdAt: deck.createdAt.toISOString(),
        id: undefined,
      },
      cards: cards.map(({ id, due, review, ...rest }) => ({
        ...rest,
        due: due.toISOString(),
        review: review.toISOString(),
      })),
    });
  });

  test("セッションが見つからないエラーケース", async () => {
    const spy = vi
      .spyOn(AnkiSessionService.prototype, "getSessionAndDeckById")
      .mockImplementation(async () => {
        return undefined;
      });

    const res = await client.api.auth.verified.ankiSession[":id"].$get({
      param: { id: "non_existent_session" },
    });

    expect(res.status).toBe(404);
    const jsonResponse = await res.json();
    expect(jsonResponse).toEqual({ error: "not found" });
    spy.mockRestore();
  });
});
