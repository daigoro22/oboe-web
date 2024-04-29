import * as React from "react";
import { Logo } from "../Logo";
// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type HeaderProps = {};
export const Header = (props: HeaderProps) => {
	return (
		<header className="w-full h-20 flex items-center justify-center bg-white">
			<Logo />
		</header>
	);
};
