import type { Meta, StoryFn } from "@storybook/react";

import React from "react";
import { Header } from "./Header";

const meta: Meta = {
	title: "Components/Header",
	component: Header,
	parameters: {
		controls: { expanded: true },
	},
};

export default meta;

const Template: StoryFn = (props) => (
	<Header {...props}>
		<p>Hello</p>
	</Header>
);

export const Default = Template.bind({});
Default.args = {};
