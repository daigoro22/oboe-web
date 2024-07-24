import type { Env as Ev, Context as C } from "hono";

export interface Env extends Ev {
  Bindings: { DB: D1Database };
  Variables: { userData: { id: number; point: number; customerId: string } };
}

export type Context = C<Env>;
