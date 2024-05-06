import "reflect-metadata";

import SignUpService, {
	type ISignUp,
} from "./signUp.service";
import { AbstractFakerUtil, generateFakePromise } from "@/lib/test-helper";
import { container } from "tsyringe";
import { beforeAll, describe, expect, test } from "vitest";

let  signUp: SignUpService;

class fakeRepository extends AbstractFakerUtil implements ISignUp {
}

beforeAll(async () => {
	container.register("ISignUp", {
		useClass: fakeRepository,
	});
	signUp = container.resolve(SignUpService);
});

describe("signUp.service", () => {
	test("signUp.service", async () => {});
});
