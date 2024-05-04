import { getOptions } from "@/features/auth/routes/server/formOptions/formOptions.service";
import type { Env } from "env";
import { Hono } from "hono";

export const formOptions = new Hono<Env>();

formOptions.get("/register/options", async (c) => {
	const res = await getOptions(c.env.DB);
	return c.json(res);
});
