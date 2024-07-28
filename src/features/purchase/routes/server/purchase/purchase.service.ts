import type { IUser } from "@/features/misc/routes/server/user/user.service";
import type Stripe from "stripe";
import { inject, injectable } from "tsyringe";

export interface IPurchase {
  getAllProductsAndPrices(): Promise<Stripe.Price[]>;
  purchase(
    priceId: string,
    quantity: number,
    customerId: string,
    returnUrl: string,
  ): Promise<Stripe.Checkout.Session>;
  createCustomer(
    userName: string,
    idempotencyKey: string,
  ): Promise<Stripe.Customer>;
  getSessionLineItem(sessionId: string): Promise<Stripe.LineItem[]>;
}

@injectable()
export default class PurchaseService {
  constructor(
    @inject("IPurchase") private _purchase: IPurchase,
    @inject("IUser") private _user: IUser,
  ) {}

  async getAllProductsAndPrices() {
    const products = await this._purchase.getAllProductsAndPrices();
    return products;
  }

  async purchase(
    userId: number,
    currentPoint: number,
    priceId: string,
    quantity: string | undefined,
    customerId: string,
    returnUrl: string,
  ) {
    if (!(quantity && !Number.isNaN(Number(quantity)))) {
      throw new InvalidQuantityError();
    }
    const session = await this._purchase.purchase(
      priceId,
      Number(quantity),
      customerId,
      returnUrl,
    );

    if (!session.amount_total) {
      throw new InvalidAmountTotalError();
    }
    await this._user.setPoint(userId, currentPoint + session.amount_total); //TODO: amount_total ではなくStripe のメタデータ使う

    return session;
  }

  async createCustomer(userName: string, idempotencyKey: string) {
    const customer = await this._purchase.createCustomer(
      userName,
      idempotencyKey,
    );
    return customer;
  }

  async getSessionLineItem(sessionId: string) {
    const session = await this._purchase.getSessionLineItem(sessionId);
    return session;
  }
}

export class InvalidQuantityError extends Error {
  constructor() {
    super("Invalid quantity");
  }
}

export class InvalidAmountTotalError extends Error {
  constructor() {
    super("Invalid amount total");
  }
}
