import type { Meta, StoryFn } from "@storybook/react";
import React from "react";

import { Select } from "@/components/elements/Select";
import { Input } from "@/components/ui/input";
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
		<Select
			id="selectInput"
			placeholder="オプションを選択"
			items={[
				{ label: "選択肢1", value: "1" },
				{ label: "選択肢2", value: "2" },
				{ label: "選択肢3", value: "3" },
			]}
		/>
	),
};
