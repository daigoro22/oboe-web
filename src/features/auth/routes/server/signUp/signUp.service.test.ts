import "reflect-metadata";

import SignUpService from "./signUp.service";
import { container } from "tsyringe";
import { beforeAll, describe, test } from "vitest";
import { SignUpFakeRepository } from "@/lib/test-helper/signUp";

let signUp: SignUpService;

beforeAll(async () => {
	container.register("ISignUp", {
		useClass: SignUpFakeRepository,
	});
	signUp = container.resolve(SignUpService);
});

describe("signUp.service", () => {
	test("signUp.service", async () => {});
});
