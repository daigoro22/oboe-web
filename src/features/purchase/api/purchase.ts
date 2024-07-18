import type { PurchaseRoute } from "@/features/purchase/routes/server/purchase/purchase.controller";
import { hc } from "hono/client";

export const getAllProductsAndPrices = async () => {
  const client = hc<PurchaseRoute>("http://localhost:5173/"); //FIXME: baseUrl を環境に合わせて変更
  const res = await client.api.auth.verified.purchase.$get();
  return await res.json();
};

export type AllProductsAndPricesResponse = Awaited<
  ReturnType<typeof getAllProductsAndPrices>
>;
