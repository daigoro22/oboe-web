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

  async purchase(
    priceId: string,
    quantity: number,
  ): Promise<Stripe.Checkout.Session> {
    const origin = import.meta.env.VITE_ORIGIN;
    const session = await this.stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      return_url: `${origin}/purchase/return?session_id={CHECKOUT_SESSION_ID}`,
      ui_mode: "embedded",
      line_items: [{ price: priceId, quantity }],
    });

    return session;
  }

  async createCustomer(
    userName: string,
    idempotencyKey: string,
  ): Promise<Stripe.Customer> {
    const customer = await this.stripe.customers.create(
      {
        name: userName,
      },
      { idempotencyKey },
    );
    return customer;
  }
}
