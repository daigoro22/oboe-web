import type { PurchaseRoute } from "@/features/purchase/routes/server/purchase/purchase.controller";
import { hc } from "hono/client";

const client = hc<PurchaseRoute>("http://localhost:5173/"); //FIXME: baseUrl を環境に合わせて変更

export const getAllProductsAndPrices = async () => {
  const res = await client.api.auth.verified.purchase.$get();
  return await res.json();
};

export const checkout = async (priceId: string) => {
  const res = await client.api.auth.verified.purchase.checkout[
    ":priceId"
  ].$post({
    param: { priceId },
  });
  return await res.json();
};

export type AllProductsAndPricesResponse = Awaited<
  ReturnType<typeof getAllProductsAndPrices>
>;

export const getSession = async (sessionId: string) => {
  const res = await client.api.auth.verified.purchase.session[
    ":sessionId"
  ].$get({
    param: { sessionId },
  });

  return await res.json();
};
