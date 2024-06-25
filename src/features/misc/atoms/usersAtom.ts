import type { UsersRoute } from "@/features/misc/routes/server/user/user.controller";
import { hc } from "hono/client";
import { atomWithQuery } from "jotai-tanstack-query";

const client = hc<UsersRoute>("/");

export const getUsersAtom = atomWithQuery(() => ({
  queryKey: ["getUsers"],
  queryFn: async () => {
    const data = await client.api.auth.verified.users.$get(undefined);
    const json = await data.json();
    if (!data.ok) {
      throw new Error("ユーザー取得エラー");
    }
    return json;
  },
}));
