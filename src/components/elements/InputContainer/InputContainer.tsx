import { Label } from "@/components/ui/label";
import type * as React from "react";

// biome-ignore lint/complexity/noBannedTypes: <explanation></explanation>
export type InputContainerProps = React.PropsWithChildren<
	Pick<React.ComponentPropsWithoutRef<"label">, "htmlFor"> & {
		label: string;
	}
>;
export const InputContainer = ({
	htmlFor,
	label,
	children,
}: InputContainerProps) => {
	return (
		<div className="grid w-full max-w-sm items-center gap-1.5">
			<Label htmlFor={htmlFor}>{label}</Label>
			{children}
		</div>
	);
};
