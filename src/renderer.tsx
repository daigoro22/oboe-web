import { SessionProvider } from "@hono/auth-js/react";
import { reactRenderer } from "@hono/react-renderer";
import React from "react";

export const renderer = reactRenderer(({ children }) => {
	return (
		<SessionProvider>
			<html lang="ja">
				<head>
					<link href="/src/globals.css" rel="stylesheet" />
				</head>
				<body>{children}</body>
			</html>
		</SessionProvider>
	);
});
