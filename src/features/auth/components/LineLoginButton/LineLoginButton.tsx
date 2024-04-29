import { Button } from "@/components/ui/button";
import { signIn } from "@hono/auth-js/react";
import * as React from "react";
// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type LineLoginButtonProps = {};
export const LineLoginButton = (props: LineLoginButtonProps) => {
	return (
		<Button
			onClick={() => {
				(async () => {
					await signIn();
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
