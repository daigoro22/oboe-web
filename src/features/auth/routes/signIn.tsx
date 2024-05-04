import { CardLayout } from "@/components/elements/CardLayout";
import { Grid } from "@/components/elements/Grid";
import { GridContainer } from "@/components/elements/GridContainer";
import { LineSignInButton } from "@/features/auth/components/LineSignInButton";
import { SessionProvider } from "@hono/auth-js/react";
import React from "react";
import { createRoot } from "react-dom/client";

export const SignIn = ({ register = false }: { register?: boolean }) => {
	return (
		<Grid>
			<GridContainer>
				<CardLayout
					title={register ? "LINE で Oboe に登録" : "LINE でログイン"}
					desc="LINE 公式のログイン画面に移動します"
				>
					<LineSignInButton callbackUrl={register ? "/signUp" : "/"} />
				</CardLayout>
			</GridContainer>
		</Grid>
	);
};
