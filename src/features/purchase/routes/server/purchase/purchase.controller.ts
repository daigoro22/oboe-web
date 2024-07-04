import PurchaseRepository from "./purchase.repository";
import PurchaseService, { InvalidQuantityError } from "./purchase.service";
import type { Env } from "env";
import { Hono } from "hono";
import { createFactory, createMiddleware } from "hono/factory";
import { error } from "node:console";

import { container } from "tsyringe";

const ROUTE = "/api/auth/verified/purchase" as const;
const factory = createFactory();

export const purchaseContainerMiddleware = createMiddleware(async (c, next) => {
  container.register("IPurchase", {
    useValue: new PurchaseRepository(),
  });
  await next();
});

const getAllProductsAndPrices = factory.createHandlers(async (c) => {
  const purchase = container.resolve(PurchaseService);
  const products = await purchase.getAllProductsAndPrices();
  return c.json(products);
});

const _purchase = factory.createHandlers(async (c) => {
  const priceId = c.req.param("priceId");
  const quantity = c.req.query("quantity");

  const purchase = container.resolve(PurchaseService);
  try {
    const session = await purchase.purchase(priceId, quantity);
    return c.json(session);
  } catch (e) {
    if (e instanceof InvalidQuantityError) {
      return c.json({ error: "数量が不正な値です" }, 400);
    }
    return c.json({ error: "server error" }, 500);
  }
});

export const purchase = new Hono<Env>()
  .basePath(ROUTE)
  .get("/", ...getAllProductsAndPrices)
  .post("/purchase/:priceId", ..._purchase);
