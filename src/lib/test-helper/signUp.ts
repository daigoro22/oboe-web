import { faker } from "@/db/faker";
import type { ISignUp } from "@/features/auth/routes/server/signUp/signUp.service";
import { AbstractFakerUtil } from "@/lib/test-helper/faker";

export class SignUpFakeRepository extends AbstractFakerUtil implements ISignUp {
  async signUp(_, __) {
    new Promise(() => true);
  }
  async getAccountAndUser(_) {
    return {
      accountId: faker.number.int({ max: 100, min: 0 }),
      userId: faker.number.int({ max: 100, min: 0 }),
    };
  }
}
