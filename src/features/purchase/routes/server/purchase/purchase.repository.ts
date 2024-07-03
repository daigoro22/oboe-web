import Stripe from "stripe";
import type { IPurchase } from "./purchase.service";

export default class PurchaseRepository implements IPurchase {
  private stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY);
  }

  async getAllProductsAndPrices(): Promise<Stripe.Price[]> {
    const prices = await this.stripe.prices.list({
      limit: 100,
      expand: ["data.product"],
    });
    return prices.data;
  }
}
