import AnkiSessionRepository from "./ankiSession.repository";
import AnkiSessionService, {
  type SessionAndPoint,
} from "./ankiSession.service";
import type { Env } from "env";
import { type Context as C, Hono } from "hono";
import { createFactory, createMiddleware } from "hono/factory";
import { container } from "tsyringe";

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
  let sessionAndPoint: SessionAndPoint;
  try {
    sessionAndPoint = await ankiSession.getLatestSessionAndPoint(user.id);
  } catch (error) {
    return c.json({ error: "server error" }, 500);
  }
  return c.json(sessionAndPoint);
});

const newPost = factory.createHandlers(async (c: Context) => {
  const ankiSession = container.resolve(AnkiSessionService);
  const user = c.get("userData");
  const newSession = await ankiSession.startSession(user);
  return c.json({ sessionId: newSession });
});

const idGet = factory.createHandlers(async (c: Context) => {
  const ankiSession = container.resolve(AnkiSessionService);
  const user = c.get("userData");
  const id = c.req.param("id");
  let session: Awaited<ReturnType<typeof ankiSession.getSessionById>>;
  try {
    session = await ankiSession.getSessionById(user.id, id);
    if (!session) {
      return c.json({ error: "not found" }, 404);
    }
  } catch (e) {
    return c.json({ error: "server error" }, 500);
  }
  return c.json({ sessionId: session.id });
});

export const ankiSession = new Hono<Env>()
  .get(`${ROUTE}/latest`, ...latestGet)
  .post(`${ROUTE}/new`, ...newPost)
  .get(`${ROUTE}/:id`, ...idGet);
