import type { Env } from "env";
import { createMiddleware } from "hono/factory";
import { container } from "tsyringe";
import UserService from "@/features/auth/routes/server/user/user.service";

export const verifySignupMiddleware = createMiddleware<Env>(async (c, next) => {
  const authUser = c.get("authUser");

  const userService = container.resolve(UserService);
  const userData = await userService.getUser(authUser?.session.user?.id);

  if (!userData) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("userData", userData);
  await next();
});
