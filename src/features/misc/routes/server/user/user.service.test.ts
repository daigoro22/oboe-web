import "reflect-metadata";

import UserService from "./user.service";
import { container } from "tsyringe";
import { beforeAll, describe, expect, test } from "vitest";
import { UserFakeRepository } from "@/lib/test-helper/user";

let user: UserService;

beforeAll(async () => {
  container.register("IUser", {
    useClass: UserFakeRepository,
  });
  user = container.resolve(UserService);
});

describe("user.service", () => {
  test("通常ケース", async () => {
    const userData = await user.getUser("test");
    expect(userData).toEqual({ id: 1, point: 10000, customerId: "test" });
  });
});
