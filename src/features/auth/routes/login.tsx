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
			<Content />
		</SessionProvider>
	);
};

const domNode = document.getElementById("root")!;
const root = createRoot(domNode);
root.render(<Login />);
