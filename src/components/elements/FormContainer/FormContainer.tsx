import {
	FormDescription,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import type * as React from "react";

// biome-ignore lint/complexity/noBannedTypes: <explanation></explanation>
export type FormContainerProps = React.PropsWithChildren<{
	label: string;
	desc?: string;
}>;
export const FormContainer = ({
	label,
	desc,
	children,
}: FormContainerProps) => {
	return (
		<FormItem>
			<FormLabel>{label}</FormLabel>
			{children}
			<FormDescription>{desc}</FormDescription>
			<FormMessage />
		</FormItem>
	);
};
