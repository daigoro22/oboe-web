import { reactRenderer } from "@hono/react-renderer";

export const renderer = reactRenderer(({ children }) => {
	return (
		<html lang="ja">
			<head>
				<link href="/src/globals.css" rel="stylesheet" />
			</head>
			<body>{children}</body>
		</html>
	);
});
