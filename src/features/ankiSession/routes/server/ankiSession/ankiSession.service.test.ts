import "reflect-metadata";

import AnkiSessionService from "./ankiSession.service";
import { container } from "tsyringe";
import { beforeAll, describe, expect, test } from "vitest";
import {
  AnkiSessionFakeRepository,
  TEST_SESSION,
} from "@/lib/test-helper/ankiSession";
import { FakeTransaction } from "@/lib/test-helper";
import { ANKI_SESSION_POINT } from "@/lib/constant";
let ankiSession: AnkiSessionService;

beforeAll(async () => {
  container.register("IAnkiSession", {
    useClass: AnkiSessionFakeRepository,
  });
  container.register("Transaction", {
    useClass: FakeTransaction,
  });
  ankiSession = container.resolve(AnkiSessionService);
});

describe("getLatestSessionAndPoint", () => {
  test("通常ケース", async () => {
    const res = await ankiSession.getLatestSessionAndPoint(1);
    expect(res).toEqual({
      point: 100,
      session: {
        id: 1,
        deckId: "1",
        deckPublicId: "test_deck",
        startsAt: null,
        endsAt: null,
        userId: 1,
        createdAt: new Date(),
        isResumable: 1,
        resumeCount: 0,
        publicId: "test_session",
      },
    });
  });
});

describe("getSessionById", () => {
  test("通常ケース", async () => {
    const publicId = "test";
    const res = await ankiSession.getSessionById(1, publicId);
    expect(res).toEqual(TEST_SESSION);
  });
});

describe("startSession", () => {
  test("通常ケース", async () => {
    await expect(
      ankiSession.startSession(
        { id: 1, point: ANKI_SESSION_POINT },
        "test_deck",
      ),
    ).resolves.not.toThrowError();
    //FIXME: トランザクションの中身をテスト
  });
});
