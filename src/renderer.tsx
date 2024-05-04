import { Header } from "@/components/elements/Header";
import { reactRenderer } from "@hono/react-renderer";
import React, { type ReactElement } from "react";

declare module "@hono/react-renderer" {
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	type Props = {};
}

export const clientRenderer = reactRenderer(({ children }) => {
	return (
		<html lang="ja">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link href="/src/globals.css" rel="stylesheet" />
				<script type="module" src="/src/index.client.tsx" />
			</head>
			<body className="bg-bg-primary">
				<Header />
				{children}
			</body>
		</html>
	);
});
