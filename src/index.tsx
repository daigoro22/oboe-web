import "reflect-metadata";

import { formOptions } from "@/features/auth/routes/server/formOptions/formOptions.controller";
import Line from "@auth/core/providers/line";
import {
	type AuthConfig,
	authHandler,
	initAuthConfig,
	verifyAuth,
} from "@hono/auth-js";
import type { Env } from "env";
import { type Context, Hono } from "hono";
import { env, getRuntimeKey } from "hono/adapter";
import { cors } from "hono/cors";
import React from "react";
import { clientRenderer } from "./renderer";

const app = new Hono<Env>({ strict: false });

app.use(
	"*",
	cors({
		origin: (origin) => origin,
		allowHeaders: ["Content-Type"],
		credentials: true,
	}),
);

app.use("*", initAuthConfig(getAuthConfig));

app.use("/api/auth/*", authHandler());

app.use("/api/*", verifyAuth());

app.route("/api/register/formOptions", formOptions);

app.get("/api/protected", (c) => {
	const auth = c.get("authUser");
	return c.json(auth);
});

function getAuthConfig(c: Context): AuthConfig {
	const {
		AUTH_SECRET: secret,
		AUTH_LINE_ID: clientId,
		AUTH_LINE_SECRET: clientSecret,
	} = env<{
		AUTH_SECRET: string;
		AUTH_LINE_ID: string;
		AUTH_LINE_SECRET: string;
	}>(c, getRuntimeKey());
	return {
		secret,
		providers: [Line({ clientId, clientSecret, checks: ["state"] })],
	};
}

app.use("*", clientRenderer);

app.get("*", async (c) => {
	return c.render(<div id="root" />);
});

export default app;
