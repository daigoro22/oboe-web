import SignUpRepository from "./signUp.repository";
import SignUpService from "./signUp.service";
import type { Env } from "env";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { zValidator } from "@hono/zod-validator";

import { container } from "tsyringe";
import { signUpSchema } from "@/schemas/signUp";
import { DrizzleError } from "drizzle-orm";
import PurchaseService from "@/features/purchase/routes/server/purchase/purchase.service";

const ROUTE = "/api/auth/signup" as const;

export const signUpContainerMiddleware = createMiddleware(async (c, next) => {
  container.register("ISignUp", {
    useValue: new SignUpRepository(c.env.DB),
  });
  await next();
});

export const signUp = new Hono<Env>().post(
  ROUTE,
  zValidator("json", signUpSchema, async (result, c) => {
    const auth = c.get("authUser");

    const { success, data } = result;

    if (!success) {
      return c.json(result.error, 400);
    }
    if (!auth?.token?.sub) {
      return c.json({ error: "user not found" }, 500);
    }

    const purchase = container.resolve(PurchaseService);
    const customer = await purchase.createCustomer(data.name, auth.token.sub);

    const signUp = container.resolve(SignUpService);
    try {
      await signUp.signUp(
        {
          ...data,
          birthDate: new Date(data.birthDate),
          customerId: customer.id, //TODO: Stripe API を使用して ID を取得
          image: auth.session?.user?.image,
        },
        auth.token,
      );
    } catch (e) {
      if (e instanceof DrizzleError) {
        return c.json({ error: "cannot create user data" }, 500);
      }
      return c.json({ error: "server error" }, 500);
    }

    return c.text("success", 201);
  }),
);

export type SignUpRoute = typeof signUp;
