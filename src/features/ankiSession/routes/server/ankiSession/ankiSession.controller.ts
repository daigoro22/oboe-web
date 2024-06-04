import { zValidator } from "@hono/zod-validator";
import AnkiSessionRepository from "./ankiSession.repository";
import AnkiSessionService, {
  InsufficientPointError,
} from "./ankiSession.service";
import type { Env } from "env";
import { type Context as C, Hono } from "hono";
import { createFactory, createMiddleware } from "hono/factory";
import { container } from "tsyringe";
import { newSessionSchema } from "@/schemas/ankiSession";

type Context = C<Env>;

const ROUTE = "/api/auth/verified/ankiSession" as const;

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
  return c.json(session);
});

const newPost = factory.createHandlers(
  zValidator("json", newSessionSchema, async (result, c) => {
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
  }),
);

const idGet = factory.createHandlers(async (c: Context) => {
  const ankiSession = container.resolve(AnkiSessionService);
  const user = c.get("userData");
  const id = c.req.param("id");
  let data: Awaited<ReturnType<typeof ankiSession.getSessionAndDeckById>>;
  try {
    data = await ankiSession.getSessionAndDeckById(user.id, id);
    if (!data) {
      return c.json({ error: "not found" }, 404);
    }
  } catch (e) {
    return c.json({ error: "server error" }, 500);
  }

  const {
    session: { id: _, ...session },
    deck: { id: __, ...deck },
    cards,
  } = data;
  return c.json({
    session,
    deck,
    cards: cards.map(({ id: _, ...card }) => card),
  });
});

export const ankiSession = new Hono<Env>()
  .get(`${ROUTE}/latest`, ...latestGet)
  .post(`${ROUTE}/new`, ...newPost)
  .get(`${ROUTE}/:id`, ...idGet);
