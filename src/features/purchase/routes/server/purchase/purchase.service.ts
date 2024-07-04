import type Stripe from "stripe";
import { inject, injectable } from "tsyringe";

export interface IPurchase {
  getAllProductsAndPrices(): Promise<Stripe.Price[]>;
  purchase(priceId: string, quantity: number): Promise<Stripe.Checkout.Session>;
}

@injectable()
export default class PurchaseService {
  constructor(@inject("IPurchase") private _purchase: IPurchase) {}

  async getAllProductsAndPrices() {
    const products = await this._purchase.getAllProductsAndPrices();
    return products;
  }

  async purchase(priceId: string, quantity: string | undefined) {
    if (!(quantity && !Number.isNaN(Number(quantity)))) {
      throw new InvalidQuantityError();
    }
    const session = await this._purchase.purchase(priceId, Number(quantity));
    return session;
  }
}

export class InvalidQuantityError extends Error {
  constructor() {
    super("Invalid quantity");
  }
}
