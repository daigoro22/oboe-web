import type { Meta, StoryFn } from "@storybook/react";
import React from "react";

import { Logo } from "./Logo";

const meta: Meta = {
	title: "Components/Logo",
	component: Logo,
	parameters: {
		controls: { expanded: true },
	},
};

export default meta;

const Template: StoryFn = (props) => <Logo {...props}>Hello</Logo>;

export const Default = Template.bind({});
Default.args = {};
