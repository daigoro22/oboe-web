import type { IPurchase } from "@/features/purchase/routes/server/purchase/purchase.service";
import { AbstractFakerUtil } from "@/lib/test-helper/faker";
import { faker } from "@faker-js/faker";
import type Stripe from "stripe";

export const TEST_PRICES: Stripe.Price[] = [
  {
    id: faker.string.uuid(),
    object: "price",
    active: false,
    billing_scheme: "per_unit",
    created: 0,
    currency: "",
    custom_unit_amount: null,
    livemode: false,
    lookup_key: null,
    metadata: {},
    nickname: null,
    product: "",
    recurring: null,
    tax_behavior: null,
    tiers_mode: null,
    transform_quantity: null,
    type: "recurring",
    unit_amount: null,
    unit_amount_decimal: null,
  },
];

export class PurchaseFakeRepository
  extends AbstractFakerUtil
  implements IPurchase
{
  async getAllProductsAndPrices() {
    return TEST_PRICES;
  }
}
