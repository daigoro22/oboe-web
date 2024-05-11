import type { Env as Ev } from "hono";

export interface Env extends Ev {
  Bindings: { DB: D1Database };
}
