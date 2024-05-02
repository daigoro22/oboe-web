import { FormControl } from "@/components/ui/form";
import {
	Select as ScSelect,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type * as React from "react";

export type SelectProps = {
	placeholder: string;
	items: { value: string; label: string }[];
	isForm?: boolean;
};
type ScSelectProps = React.ComponentProps<typeof ScSelect>;
export const Select: React.FC<SelectProps & ScSelectProps> = ({
	placeholder,
	items,
	isForm = true,
	...props
}) => {
	const Trigger = () => (
		<SelectTrigger>
			<SelectValue placeholder={placeholder} />
		</SelectTrigger>
	);

	return (
		<ScSelect {...props}>
			{isForm ? (
				<FormControl>
					<Trigger />
				</FormControl>
			) : (
				<Trigger />
			)}
			<SelectContent>
				{items.map(({ label, value }) => (
					<SelectItem key={value} value={value}>
						{label}
					</SelectItem>
				))}
			</SelectContent>
		</ScSelect>
	);
};
