import PurchaseRepository from "./purchase.repository";
import PurchaseService from "./purchase.service";
import type { Env } from "env";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";

import { container } from "tsyringe";

const ROUTE = "/api/auth/verified/purchase" as const;

export const purchaseContainerMiddleware = createMiddleware(async (c, next) => {
  container.register("IPurchase", {
    useValue: new PurchaseRepository(),
  });
  await next();
});

export const purchase = new Hono<Env>().get(ROUTE, async (c) => {
  const purchase = container.resolve(PurchaseService);
  const products = await purchase.getAllProductsAndPrices();
  return c.json(products);
});
