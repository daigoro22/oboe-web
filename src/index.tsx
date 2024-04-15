import {
	type AuthConfig,
	authHandler,
	initAuthConfig,
	verifyAuth,
} from "@hono/auth-js";
import { type Context, Hono } from "hono";
import { env } from "hono/adapter";
import { Button } from "./components/ui/button";
import { renderer } from "./renderer";

import Line from "@auth/core/providers/line";
import React from "react";

const app = new Hono();

app.use(renderer);

app.get("/", async (c) => {
	return c.render(
		<div>
			<Button>aaa</Button>
			<h1>Hello!</h1>
		</div>,
	);
});

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
	}>(c);
	return {
		secret,
		providers: [Line({ clientId, clientSecret })],
	};
}

export default app;
