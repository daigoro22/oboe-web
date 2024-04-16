import { reactRenderer } from "@hono/react-renderer";
import React from "react";

export const renderer = reactRenderer(({ children }) => {
	return (
		<html lang="ja">
			<head>
				<meta charSet="utf-8" />
				<link href="/src/globals.css" rel="stylesheet" />
				<script type="module" src="/src/features/auth/routes/login.tsx" />
			</head>
			<body>{children}</body>
		</html>
	);
});
