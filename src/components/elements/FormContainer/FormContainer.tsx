import { Label } from "@/components/ui/label";
import type * as React from "react";

// biome-ignore lint/complexity/noBannedTypes: <explanation></explanation>
export type FormContainerProps = React.PropsWithChildren<
	Pick<React.ComponentPropsWithoutRef<"label">, "htmlFor"> & {
		label: string;
	}
>;
export const FormContainer = ({
	htmlFor,
	label,
	children,
}: FormContainerProps) => {
	return (
		<div className="grid w-full max-w-sm items-center gap-1.5">
			<Label htmlFor={htmlFor}>{label}</Label>
			{children}
		</div>
	);
};
