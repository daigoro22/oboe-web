import type { Meta, StoryFn } from "@storybook/react";
import React from "react";

import { Placeholder } from "drizzle-orm";
import { Select } from "./Select";

const meta: Meta = {
	title: "Components/Select",
	component: Select,
	parameters: {
		controls: { expanded: true },
	},
	tags: ["autodocs"],
};

export default meta;

const Template: StoryFn = (props) => <Select {...props} />;

export const Default = Template.bind({});
Default.args = {
	id: "select",
	placeholder: "選択してください",
	items: [
		{ label: "選択肢1", value: "1" },
		{ label: "選択肢2", value: "2" },
		{ label: "選択肢3", value: "3" },
	],
};
