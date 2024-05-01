import type { Meta, StoryFn } from "@storybook/react";
import React from "react";

import { CardLayout } from "./CardLayout";

const meta: Meta = {
	title: "Components/CardLayout",
	component: CardLayout,
	parameters: {
		controls: { expanded: true },
	},
	tags: ["autodocs"],
};

export default meta;

const Template: StoryFn = (props) => <CardLayout {...props}>Hello</CardLayout>;

export const Default = Template.bind({});
Default.args = { title: "テストタイトル", desc: "テストの説明です" };
