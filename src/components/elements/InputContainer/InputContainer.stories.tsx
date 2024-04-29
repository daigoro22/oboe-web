import type { Meta, StoryFn } from "@storybook/react";
import React from "react";

import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { InputContainer } from "./InputContainer";

const meta: Meta = {
	title: "Components/Input",
	component: InputContainer,
	parameters: {
		controls: { expanded: true },
	},
};

export default meta;

const Template: StoryFn = ({ label, ...props }) => (
	<InputContainer label={label} {...props}>
		{props.children}
	</InputContainer>
);

export const Default = Template.bind({});
Default.args = {
	htmlFor: "textInput",
	label: "テキストインプット",
	children: <Input id="textInput" type="text" />,
};
export const DateInput = Template.bind({});
DateInput.args = {
	htmlFor: "dateInput",
	label: "日付インプット",
	children: <Input id="dateInput" type="date" />,
};
export const SelectInput = Template.bind({});
SelectInput.args = {
	htmlFor: "selectInput",
	label: "セレクトインプット",
	children: (
		<Select>
			<SelectTrigger id="selectInput">
				<SelectValue placeholder="オプションを選択" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="option1">オプション1</SelectItem>
				<SelectItem value="option2">オプション2</SelectItem>
				<SelectItem value="option3">オプション3</SelectItem>
			</SelectContent>
		</Select>
	),
};
