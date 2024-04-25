import { Header } from "@/components/elements/Header";
import { reactRenderer } from "@hono/react-renderer";
import React, { type ReactElement } from "react";

declare module "@hono/react-renderer" {
	interface Props {
		title: string;
		pageSrc?: string;
	}
}

export const clientRenderer = reactRenderer(({ children, title, pageSrc }) => {
	return (
		<html lang="ja">
			<head>
				<meta charSet="utf-8" />
				<title>{title}</title>
				<link href="/src/globals.css" rel="stylesheet" />
				<script type="module" src={pageSrc} />
			</head>
			<body className="bg-bg-primary">
				<Header />
				{children}
			</body>
		</html>
	);
});
