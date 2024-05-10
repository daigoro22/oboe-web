import type { ISignUp } from "@/features/auth/routes/server/signUp/signUp.service";
import { AbstractFakerUtil } from "@/lib/test-helper/faker";

export class SignUpFakeRepository extends AbstractFakerUtil implements ISignUp {
	async signUp(_, __) {
		new Promise(() => true);
	}
}
