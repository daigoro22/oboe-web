import "reflect-metadata";
import { afterAll, describe, expect, test, vi } from "vitest";
import {
  AnkiSessionFakeRepository,
  TEST_SESSION,
  TEST_SESSION_AND_DECK,
} from "@/lib/test-helper/ankiSession";
import { createMiddleware } from "hono/factory";
import { container } from "tsyringe";
import { ankiSession } from "./ankiSession.controller";
import { Hono } from "hono";
import { testClient } from "hono/testing";
import { FakeTransaction, setFakeUserMiddleware } from "@/lib/test-helper";
import { verifySignupMiddleware } from "@/lib/middleware";
import { faker } from "@/db/faker";
import AnkiSessionService, {
  InsufficientPointError,
  SessionAlreadyEndedError,
  SessionNotFoundError,
} from "@/features/ankiSession/routes/server/ankiSession/ankiSession.service";
import { UserFakeRepository } from "@/lib/test-helper/user";
import { afterEach } from "bun:test";

const ankiSessionContainerMiddleware = createMiddleware(async (c, next) => {
  container.register("IAnkiSession", {
    useValue: new AnkiSessionFakeRepository(),
  });
  container.register("IUser", {
    useValue: new UserFakeRepository(),
  });
  container.register("Transaction", {
    useClass: FakeTransaction,
  });

  await next();
});

const app = new Hono({ strict: false });
app.use("*", setFakeUserMiddleware);
app.use("*", ankiSessionContainerMiddleware);
app.use("*", verifySignupMiddleware);
app.route("/", ankiSession);
const client = testClient<typeof ankiSession>(app);

afterAll(() => {
  container.clearInstances();
});

describe("latest:GET", () => {
  test("通常ケース", async () => {
    const res = await client.api.auth.verified.ankiSession.latest.$get();
    expect(res.status).toBe(200);
    const jsonResponse = await res.json();
    expect(jsonResponse).toEqual({
      publicId: TEST_SESSION.publicId,
      isResumable: TEST_SESSION.isResumable,
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

describe("resume/:id:GET", () => {
  test("通常ケース", async () => {
    const res = await client.api.auth.verified.ankiSession.resume[":id"].$post({
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
      cards: cards.map(({ id, lastReview, due, ...rest }) => ({
        ...rest,
        lastReview: lastReview.toISOString(),
        due: due.toISOString(),
      })),
    });
  });

  test("セッションが見つからないエラーケース", async () => {
    const spy = vi
      .spyOn(AnkiSessionService.prototype, "resumeSession")
      .mockImplementation(async () => {
        throw new SessionNotFoundError("セッションが見つかりません");
      });

    const res = await client.api.auth.verified.ankiSession.resume[":id"].$post({
      param: { id: "non_existent_session" },
    });

    expect(res.status).toBe(404);
    const jsonResponse = await res.json();
    expect(jsonResponse).toEqual({ error: "セッションが見つかりません" });
    spy.mockRestore();
  });
});

describe(":id:PUT", () => {
  const json = {
    deckPublicId: TEST_SESSION_AND_DECK?.deck.publicId ?? "",
    cards:
      TEST_SESSION_AND_DECK?.cards.map(({ publicId: cardPublicId }) => ({
        cardPublicId,
        grade: faker.helpers.arrayElement([1, 2, 3, 4]),
      })) ?? [],
  };
  test("通常ケース", async () => {
    const res = await client.api.auth.verified.ankiSession[":id"].$put({
      param: { id: TEST_SESSION_AND_DECK?.session.publicId ?? "" },
      json,
    });
    expect(res.status).toBe(200);
  });

  test("セッションが見つからないエラーケース", async () => {
    const spy = vi
      .spyOn(AnkiSessionService.prototype, "endSession")
      .mockImplementation(async () => {
        throw new SessionNotFoundError("セッションが見つかりません");
      });

    const res = await client.api.auth.verified.ankiSession[":id"].$put({
      param: { id: "non_existent_session" },
      json,
    });

    expect(res.status).toBe(404);
    const jsonResponse = await res.json();
    expect(jsonResponse).toEqual({ error: "セッションが見つかりません" });
    spy.mockRestore();
  });

  test("セッションがすでに終了しているエラーケース", async () => {
    const spy = vi
      .spyOn(AnkiSessionService.prototype, "endSession")
      .mockImplementation(async () => {
        throw new SessionAlreadyEndedError("セッションはすでに終了しています");
      });

    const res = await client.api.auth.verified.ankiSession[":id"].$put({
      param: { id: "already_ended_session" },
      json,
    });

    expect(res.status).toBe(409);
    const jsonResponse = await res.json();
    expect(jsonResponse).toEqual({ error: "セッションはすでに終了しています" });
    spy.mockRestore();
  });
});

describe(":id:GET", () => {
  test("通常ケース", async () => {
    const res = await client.api.auth.verified.ankiSession[":id"].$get({
      param: { id: TEST_SESSION_AND_DECK?.session.publicId ?? "" },
    });
    expect(res.status).toBe(200);
  });
  test("セッションが見つからないケース", async () => {
    const spy = vi
      .spyOn(AnkiSessionService.prototype, "getSession")
      .mockImplementation(async () => {
        throw new SessionNotFoundError("セッションが見つかりません");
      });

    const res = await client.api.auth.verified.ankiSession[":id"].$get({
      param: { id: "non_existent_session" },
    });

    expect(res.status).toBe(404);
    const jsonResponse = await res.json();
    expect(jsonResponse).toEqual({ error: "セッションが見つかりません" });
    spy.mockRestore();
  });
});
