import {
	type AuthConfig,
	authHandler,
	initAuthConfig,
	verifyAuth,
} from "@hono/auth-js";
import { type Context, Hono } from "hono";
import { cors } from "hono/cors";

import { env, getRuntimeKey } from "hono/adapter";
import { clientRenderer } from "./renderer";

import Line from "@auth/core/providers/line";
import React from "react";

const app = new Hono({ strict: false });

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
