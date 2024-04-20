import type React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars export
export type LogoProps = {};
import LogoSvg from "@/assets/logo.svg?react";

export const Logo: React.FC = () => {
	return <LogoSvg width="3.75rem" height="3.75rem" viewBox="0 0 1000 1000" />;
};
