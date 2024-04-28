import type { Meta, StoryFn } from "@storybook/react";
import React from "react";

import { LineLoginButton } from "./LineLoginButton";

const meta: Meta = {
	title: "Components/LineLoginButton",
	component: LineLoginButton,
	parameters: {
		controls: { expanded: true },
	},
};

export default meta;

const Template: StoryFn = (props) => (
	<LineLoginButton {...props}>Hello</LineLoginButton>
);

export const Default = Template.bind({});
Default.args = {};
