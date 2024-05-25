import "reflect-metadata";

import AnkiSessionService from "./ankiSession.service";
import { container } from "tsyringe";
import { beforeAll, describe, expect, test } from "vitest";
import { AnkiSessionFakeRepository } from "@/lib/test-helper/ankiSession";

let ankiSession: AnkiSessionService;

beforeAll(async () => {
  container.register("IAnkiSession", {
    useClass: AnkiSessionFakeRepository,
  });
  ankiSession = container.resolve(AnkiSessionService);
});

describe("ankiSession.service", () => {
  test("通常ケース", async () => {
    const res = await ankiSession.getLatestSessionAndPoint(1);
    expect(res).toEqual({
      point: 100,
      session: {
        id: 1,
        deckId: "1",
        startsAt: null,
        endsAt: null,
        userId: "1",
        createdAt: new Date(),
        isResumable: 1,
        resumeCount: 0,
      },
    });
  });
});
