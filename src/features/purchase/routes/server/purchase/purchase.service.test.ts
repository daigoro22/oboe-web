import "reflect-metadata";

import PurchaseService from "./purchase.service";
import { container } from "tsyringe";
import { beforeAll, describe, expect, test } from "vitest";
import { PurchaseFakeRepository } from "@/lib/test-helper/purchase";

let purchase: PurchaseService;

beforeAll(async () => {
  container.register("IPurchase", {
    useClass: PurchaseFakeRepository,
  });
  purchase = container.resolve(PurchaseService);
});

describe("purchase.service", () => {
  test("通常ケース", async () => {});
});
