import AnkiSessionRepository from "./ankiSession.repository";
import AnkiSessionService from "./ankiSession.service";
import type { Env } from "env";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { container } from "tsyringe";

const ROUTE = "/api/ankiSession" as const;

export const ankiSessionContainerMiddleware = createMiddleware(
  async (c, next) => {
    container.register("IAnkiSession", {
      useValue: new AnkiSessionRepository(c.env.DB),
    });
    await next();
  },
);

export const ankiSession = new Hono<Env>().get(`${ROUTE}/latest`, async (c) => {
  const ankiSession = container.resolve(AnkiSessionService);
  let sessionAndPoint;
  try {
    sessionAndPoint = await ankiSession.getLatestSessionAndPoint(
      c.get("authUser").session.user?.id,
    );
  } catch (error) {
    return c.json({ error: "server error" }, 500);
  }
  return c.json(sessionAndPoint);
});
