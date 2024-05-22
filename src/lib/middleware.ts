import type { Env } from "env";
import { createMiddleware } from "hono/factory";
import { container } from "tsyringe";
import SignUpService from "@/features/auth/routes/server/signUp/signUp.service";

export const verifySignupMiddleware = createMiddleware<Env>(async (c, next) => {
  const user = c.get("authUser");

  const signUp = container.resolve(SignUpService);
  const isSignedUp = await signUp.isSignedUp(user);

  if (!isSignedUp) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
});
