import type { users } from "@/db/schema";
import type { IUser } from "@/features/auth/routes/server/user/user.service";
import { AbstractFakerUtil } from "@/lib/test-helper/faker";

export class UserFakeRepository extends AbstractFakerUtil implements IUser {
  async getUser() {
    return new Promise<typeof users.$inferSelect>((resolve) => {
      resolve({
        id: 1,
        name: "test",
        image: null,
        birthDate: new Date(),
        gender: "男",
        occupationId: 1,
        objectiveId: 1,
        customerId: "test",
        point: 10000,
        createdAt: new Date(),
      });
    });
  }
}
