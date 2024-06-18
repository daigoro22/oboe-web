import "reflect-metadata";
import AnkiSessionService, {
  InsufficientPointError,
  ResumeLimitExceededError,
  SessionAlreadyEndedError,
  SessionNotFoundError,
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
      res = await ankiSession.resumeSession(
        1,
        TEST_SESSION_AND_DECK?.session.publicId,
      );
    } catch (e) {
      console.log(e);
      expect(true).toBe(false);
    }
    const {
      session: { id: _, ...session },
      deck: { id: __, ...deck },
      cards,
    } = TEST_SESSION_AND_DECK;
    expect(res).toEqual({
      session,
      deck,
      cards: cards.map(({ id: _, ...rest }) => rest),
    });
  });

  test("復帰回数が上限を超えた場合のエラー", async () => {
    const userId = 1;
    // 復帰回数が上限に達しているセッションを設定
    const sessionWithMaxResumes = {
      ...TEST_SESSION_AND_DECK?.session,
      resumeCount: ANKI_SESSION_RESUME_LIMIT,
      isResumable: 1,
    };
    const ankiSessionMock = vi.spyOn(
      AnkiSessionFakeRepository.prototype,
      "getSessionAndDeckById",
    );
    ankiSessionMock.mockImplementation(async (_) => {
      return {
        ...TEST_SESSION_AND_DECK,
        session: sessionWithMaxResumes,
      };
    });
    // 復帰回数が上限を超えた場合のエラーを期待
    await expect(
      ankiSession.resumeSession(
        userId,
        TEST_SESSION_AND_DECK?.session.publicId,
      ),
    ).rejects.toThrow(ResumeLimitExceededError);
  });

  test("復帰不可能フラグがfalseの場合のエラー", async () => {
    const userId = 1;
    // 復帰不可能フラグがfalseのセッションを設定
    const sessionWithResumableFalse = {
      ...TEST_SESSION_AND_DECK?.session,
      resumeCount: 0,
      isResumable: 0,
    };
    const ankiSessionMock = vi.spyOn(
      AnkiSessionFakeRepository.prototype,
      "getSessionAndDeckById",
    );
    ankiSessionMock.mockImplementation(async (_) => {
      return {
        ...TEST_SESSION_AND_DECK,
        session: sessionWithResumableFalse,
      };
    });

    // 復帰不可能フラグがfalseの場合のエラーを期待
    await expect(
      ankiSession.resumeSession(
        userId,
        TEST_SESSION_AND_DECK?.session.publicId,
      ),
    ).rejects.toThrow(ResumeLimitExceededError);
  });
});

describe("endSession", () => {
  const sessionInput = [
    1,
    TEST_SESSION_AND_DECK?.session.publicId ?? "",
    TEST_SESSION_AND_DECK?.deck.publicId ?? "",
    TEST_SESSION_AND_DECK?.cards.map(({ publicId }) => ({
      cardPublicId: publicId,
      grade: 1,
    })) ?? [],
  ];
  test("通常ケース", async () => {
    await expect(
      ankiSession.endSession(...sessionInput),
    ).resolves.not.toThrowError();
  });

  test("セッションが見つからないエラーケース", async () => {
    const userId = 1;
    const sessionPublicId = "non_existent_session";
    const ankiSessionMock = vi.spyOn(
      AnkiSessionFakeRepository.prototype,
      "getSessionById",
    );
    ankiSessionMock.mockImplementation(async (_) => undefined);

    // セッションが見つからない場合のエラーを期待
    await expect(ankiSession.endSession(...sessionInput)).rejects.toThrow(
      SessionNotFoundError,
    );

    ankiSessionMock.mockRestore();
  });

  test("セッションがすでに終了しているエラーケース", async () => {
    const userId = 1;
    const sessionPublicId = "ended_session";
    const ankiSessionMock = vi.spyOn(
      AnkiSessionFakeRepository.prototype,
      "getSessionById",
    );
    ankiSessionMock.mockImplementation(async (_) => {
      return {
        ...TEST_SESSION,
        endsAt: new Date(), // 終了日時を設定して終了済みを示す
      };
    });

    // セッションが終了している場合のエラーを期待
    await expect(ankiSession.endSession(...sessionInput)).rejects.toThrow(
      SessionAlreadyEndedError,
    );

    ankiSessionMock.mockRestore();
  });
});

describe("getSession", () => {
  test("通常ケース", async () => {
    const res = await ankiSession.getSession(1, TEST_SESSION.publicId);
    expect(res).toEqual(TEST_SESSION);
  });
  test("セッションが見つからないエラーケース", async () => {
    const userId = 1;
    const sessionPublicId = "non_existent_session";
    const ankiSessionMock = vi.spyOn(
      AnkiSessionFakeRepository.prototype,
      "getSessionById",
    );
    ankiSessionMock.mockImplementation(async (_) => undefined);

    // セッションが見つからない場合のエラーを期待
    await expect(
      ankiSession.getSession(userId, sessionPublicId),
    ).rejects.toThrow(SessionNotFoundError);

    ankiSessionMock.mockRestore();
  });
});
