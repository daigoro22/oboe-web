import { Button } from "@/components/ui/button";
import { signIn } from "@hono/auth-js/react";
import * as React from "react";

export type LineSignInButtonProps = { callbackUrl: string };
export const LineSignInButton = ({ callbackUrl }: LineSignInButtonProps) => {
  return (
    <Button
      onClick={() => {
        (async () => {
          await signIn(undefined, { callbackUrl });
        })();
      }}
      className="p-0"
      variant="link"
      size="sm"
      asChild
    >
      <img src="./static/btn_login_base.png" alt="LINEでログイン" />
    </Button>
  );
};
