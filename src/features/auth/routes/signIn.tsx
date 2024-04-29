import { CardLayout } from "@/components/elements/CardLayout";
import { Grid } from "@/components/elements/Grid";
import { GridContainer } from "@/components/elements/GridContainer";
import { LineSignInButton } from "@/features/auth/components/LineSignInButton";
import { SessionProvider } from "@hono/auth-js/react";
import React from "react";
import { createRoot } from "react-dom/client";

const Content = () => {
	return (
		<>
			<LineSignInButton />
		</>
	);
};

const SignIn = () => {
	return (
		<SessionProvider>
			<Grid>
				<GridContainer>
					<CardLayout
						title="LINE でログイン"
						desc="LINE 公式のログイン画面に移動します"
					>
						<Content />
					</CardLayout>
				</GridContainer>
			</Grid>
		</SessionProvider>
	);
};

const domNode = document.getElementById("root");
if (domNode) {
	const root = createRoot(domNode);
	root.render(<SignIn />);
}
