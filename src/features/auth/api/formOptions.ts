import { hc } from "hono/client";
import type { FormOptionsRoute } from "@/features/auth/routes/server/formOptions/formOptions.controller";

export const getFormOptions = async () => {
	const client = hc<FormOptionsRoute>("http://localhost:5173/"); //FIXME: baseUrl を環境に合わせて変更
	const res = await client.api.signup.formOptions.$get();
	return await res.json();
};

export type FormOptionsResponse = Awaited<ReturnType<typeof getFormOptions>>;
