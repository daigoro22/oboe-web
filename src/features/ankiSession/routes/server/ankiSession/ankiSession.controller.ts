import { zValidator } from "@hono/zod-validator";
import AnkiSessionRepository from "./ankiSession.repository";
import AnkiSessionService, {
  CardNotFoundError,
  InsufficientPointError,
  NoReviewableCardsError,
  ResumeLimitExceededError,
  SessionAlreadyEndedError,
  SessionNotFoundError,
} from "./ankiSession.service";
import type { Env } from "env";
import { type Context as C, Hono } from "hono";
import { createFactory, createMiddleware } from "hono/factory";
import { container } from "tsyringe";
import { endSessionSchema, newSessionSchema } from "@/schemas/ankiSession";

type Context = C<Env>;

export const ROUTE = "/api/auth/verified/ankiSession" as const;

export const ankiSessionContainerMiddleware = createMiddleware(
  async (c, next) => {
    container.register("IAnkiSession", {
      useValue: new AnkiSessionRepository(c.env.DB),
    });
    await next();
  },
);

const factory = createFactory();

const latestGet = factory.createHandlers(async (c: Context) => {
  const ankiSession = container.resolve(AnkiSessionService);
  const user = c.get("userData");
  let session: Awaited<ReturnType<typeof ankiSession.getLatestSession>>;
  try {
    session = await ankiSession.getLatestSession(user.id);
  } catch (error) {
    return c.json({ error: "server error" }, 500);
  }
  const { publicId, isResumable } = session;
  return c.json({ publicId, isResumable });
});

const newPost = zValidator(
  "json",
  newSessionSchema,
  async (result, c: Context) => {
    const { success, data } = result;

    if (!success) {
      return c.json(result.error, 400);
    }

    const ankiSession = container.resolve(AnkiSessionService);
    const user = c.get("userData");

    let newSessionId: string;
    try {
      newSessionId = await ankiSession.startSession(user, data.deckId);
    } catch (error) {
      if (error instanceof InsufficientPointError) {
        return c.json({ error: error.message }, 409);
      }
      return c.json({ error: "server error" }, 500);
    }
    return c.json({ sessionId: newSessionId }, 201);
  },
);

const resumeIdPost = factory.createHandlers(async (c: Context) => {
  const ankiSession = container.resolve(AnkiSessionService);
  const user = c.get("userData");
  const id = c.req.param("id");
  let data: Awaited<ReturnType<typeof ankiSession.resumeSession>>;
  try {
    data = await ankiSession.resumeSession(user.id, id);
  } catch (e) {
    if (e instanceof SessionNotFoundError) {
      return c.json({ error: e.message }, 404);
    }
    if (
      e instanceof ResumeLimitExceededError ||
      e instanceof NoReviewableCardsError
    ) {
      return c.json({ error: e.message }, 409);
    }
    return c.json({ error: "server error" }, 500);
  }

  const { session, deck, cards } = data;
  return c.json({
    session,
    deck,
    cards,
  });
});

const idPut = zValidator(
  "json",
  endSessionSchema,
  async (result, c: Context) => {
    const { success, data } = result;
    if (!success) {
      return c.json(result.error, 400);
    }
    const ankiSession = container.resolve(AnkiSessionService);
    const user = c.get("userData");
    const sessionPublicId = c.req.param("id");

    const { cards, deckPublicId } = data;

    try {
      await ankiSession.endSession(
        user.id,
        sessionPublicId,
        deckPublicId,
        cards,
      );
    } catch (error) {
      if (
        error instanceof SessionNotFoundError ||
        error instanceof CardNotFoundError
      ) {
        return c.json({ error: error.message }, 404);
      }
      if (error instanceof SessionAlreadyEndedError) {
        return c.json({ error: error.message }, 409);
      }
      return c.json({ error: "server error" }, 500);
    }
    return c.json("success", 200);
  },
);

const idGet = factory.createHandlers(async (c) => {
  const ankiSession = container.resolve(AnkiSessionService);
  const user = c.get("userData");
  const sessionPublicId = c.req.param("id");

  try {
    const data = await ankiSession.getSession(user.id, sessionPublicId);
    return c.json(data, 200);
  } catch (error) {
    if (error instanceof SessionNotFoundError) {
      return c.json({ error: error.message }, 404);
    }
    return c.json({ error: "server error" }, 500);
  }
});

export const ankiSession = new Hono<Env>()
  .basePath(ROUTE)
  .get("/latest", ...latestGet)
  .post("/new", newPost)
  .post("/resume/:id", ...resumeIdPost)
  .put("/:id", idPut)
  .get("/:id", ...idGet);

export type AnkiSessionRoute = typeof ankiSession;
