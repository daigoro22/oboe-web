import { CardLayout } from "@/components/elements/CardLayout";
import { Grid } from "@/components/elements/Grid";
import { GridContainer } from "@/components/elements/GridContainer";
import { SessionProvider, signIn, useSession } from "@hono/auth-js/react";
import React from "react";
import { createRoot } from "react-dom/client";
import { Button } from "../../../components/ui/button";

const Content = () => {
	const { data, update } = useSession();

	return (
		<>
			<Button
				onClick={() => {
					signIn().then(console.log).catch(console.log);
				}}
			>
				Login
			</Button>
			<h1>Hello! {data?.user?.name}</h1>
		</>
	);
};

const Login = () => {
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
	root.render(<Login />);
}
