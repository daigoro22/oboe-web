import { DB, prepare } from "@/db/fixture";
import SignUpRepository from "./signUp.repository";
import { beforeAll, describe, expect, test } from "vitest";

describe("signUp.repository", () => {
	let signUpRepository: SignUpRepository;
	const { setupAll } = prepare();

	beforeAll(async () => {
		await setupAll();
		signUpRepository = new SignUpRepository(DB);
	});

	test("signUp.repository", async () => {});
});
