import "reflect-metadata";

import AnkiSessionService, {
  InsufficientPointError,
  ResumeLimitExceededError,
} from "./ankiSession.service";
import { container } from "tsyringe";
import { afterEach, beforeAll, describe, expect, test, vi } from "vitest";
import {
  AnkiSessionFakeRepository,
  TEST_SESSION,
  TEST_SESSION_AND_DECK,
} from "@/lib/test-helper/ankiSession";
import { FakeTransaction } from "@/lib/test-helper";
import { ANKI_SESSION_POINT, ANKI_SESSION_RESUME_LIMIT } from "@/lib/constant";
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

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getLatestSession", () => {
  test("通常ケース", async () => {
    const res = await ankiSession.getLatestSession(1);
    expect(res).toEqual(TEST_SESSION);
  });
});

describe("getSessionById", () => {
  test("通常ケース", async () => {
    const publicId = "test";
    const res = await ankiSession.getSessionAndDeckById(1, publicId);
    expect(res).toEqual(TEST_SESSION_AND_DECK);
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

  test("ポイントが不足している場合のエラー", async () => {
    const userWithInsufficientPoints = { id: 1, point: ANKI_SESSION_POINT - 1 }; // ANKI_SESSION_POINTより少ないポイント
    const deckPublicId = "test_deck";

    await expect(
      ankiSession.startSession(userWithInsufficientPoints, deckPublicId),
    ).rejects.toThrow(InsufficientPointError);
  });
});

describe("resumeSession", () => {
  test("通常ケース", async () => {
    let res: Awaited<ReturnType<(typeof ankiSession)["resumeSession"]>>;
    try {
      res = await ankiSession.resumeSession(1);
    } catch (e) {
      expect(true).toBe(false);
    }
    expect(res).toEqual(TEST_SESSION);
  });

  test("復帰回数が上限を超えた場合のエラー", async () => {
    const userId = 1;
    // 復帰回数が上限に達しているセッションを設定
    const sessionWithMaxResumes = {
      ...TEST_SESSION,
      resumeCount: ANKI_SESSION_RESUME_LIMIT,
      isResumable: 1,
    };
    const ankiSessionMock = vi.spyOn(
      AnkiSessionFakeRepository.prototype,
      "getLatestSession",
    );
    ankiSessionMock.mockImplementation(async (_) => {
      return {
        point: 100,
        session: sessionWithMaxResumes,
      };
    });
    // 復帰回数が上限を超えた場合のエラーを期待
    await expect(ankiSession.resumeSession(userId)).rejects.toThrow(
      ResumeLimitExceededError,
    );
  });

  test("復帰不可能フラグがfalseの場合のエラー", async () => {
    const userId = 1;
    // 復帰不可能フラグがfalseのセッションを設定
    const sessionWithResumableFalse = {
      ...TEST_SESSION,
      resumeCount: 0,
      isResumable: 0,
    };
    const ankiSessionMock = vi.spyOn(
      AnkiSessionFakeRepository.prototype,
      "getLatestSession",
    );
    ankiSessionMock.mockImplementation(async (_) => {
      return {
        point: 100,
        session: sessionWithResumableFalse,
      };
    });

    // 復帰不可能フラグがfalseの場合のエラーを期待
    await expect(ankiSession.resumeSession(userId)).rejects.toThrow(
      ResumeLimitExceededError,
    );
  });
});
