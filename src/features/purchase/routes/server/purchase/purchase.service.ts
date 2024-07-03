import type Stripe from "stripe";
import { inject, injectable } from "tsyringe";

export interface IPurchase {
  getAllProductsAndPrices(): Promise<Stripe.Price[]>;
}

@injectable()
export default class PurchaseService {
  constructor(@inject("IPurchase") private purchase: IPurchase) {}

  async getAllProductsAndPrices() {
    const products = await this.purchase.getAllProductsAndPrices();
    return products;
  }
}
