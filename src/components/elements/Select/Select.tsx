import {
	Select as ScSelect,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import * as React from "react";

// biome-ignore lint/complexity/noBannedTypes: <explanation></explanation>
export type SelectProps = {
	id: string;
	placeholder: string;
	items: { value: string; label: string }[];
};
export const Select = ({ id, placeholder, items }: SelectProps) => {
	return (
		<ScSelect>
			<SelectTrigger id={id}>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				{items.map(({ label, value }) => (
					<SelectItem value={value}>{label}</SelectItem>
				))}
			</SelectContent>
		</ScSelect>
	);
};
