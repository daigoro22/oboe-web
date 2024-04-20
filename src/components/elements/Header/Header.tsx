import * as React from "react";
import { Logo } from "../Logo";
export type HeaderProps = {}; // eslint-disable-next-line @typescript-eslint/no-unused-vars export
export const Header = (props: HeaderProps) => {
	return (
		<header className="w-full h-20 flex items-center justify-center">
			<Logo />
		</header>
	);
};
