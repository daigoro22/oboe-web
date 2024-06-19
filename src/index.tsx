import "reflect-metadata";

import {
  formOptions,
  formOptionsContainerMiddleware,
} from "@/features/auth/routes/server/formOptions/formOptions.controller";
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
import {
  signUp,
  signUpContainerMiddleware,
} from "@/features/auth/routes/server/signUp/signUp.controller";
import {
  ankiSession,
  ankiSessionContainerMiddleware,
} from "@/features/ankiSession/routes/server/ankiSession/ankiSession.controller";
import { verifySignupMiddleware } from "@/lib/middleware";
import { userContainerMiddleware } from "@/features/auth/routes/server/user/user.controller";
import { transactionContainerMiddleware } from "@/lib/transaction";
import { ROUTE as ANKI_SESSION_ROUTE } from "@/features/ankiSession/routes/server/ankiSession/ankiSession.controller";
import { logger } from "hono/logger";
import { customLogger } from "@/lib/logger";

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
app.use("*", logger(customLogger));

app.use("/api/oauth/*", authHandler());

app.use("/api/*", verifyAuth());

app.use("/api/auth/*", userContainerMiddleware);
app.use("/api/auth/*", transactionContainerMiddleware);
app.use("/api/auth/verified/*", verifySignupMiddleware);

formOptions.use("/", formOptionsContainerMiddleware);
app.route("/", formOptions);

signUp.use("/", signUpContainerMiddleware);
app.route("/", signUp);

app.use(`${ANKI_SESSION_ROUTE}/*`, ankiSessionContainerMiddleware); //FIXME: ankiSession に対して userContainerMiddleware を適用
app.route("/", ankiSession);

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
    callbacks: {
      jwt: ({ token, profile, trigger }) => {
        if (trigger === "signIn") {
          token.iss = profile?.iss;
          token.sub = profile?.sub;
        }
        return token;
      },
    },
    basePath: "/api/oauth",
  };
}

app.use("*", clientRenderer);

app.get("*", async (c) => {
  return c.render(<div id="root" />);
});

export default app;
