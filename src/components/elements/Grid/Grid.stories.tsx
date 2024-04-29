import type { Meta, StoryFn } from "@storybook/react";
import React from "react";

import { Grid } from "./Grid";

const meta: Meta = {
	title: "Components/Grid",
	component: Grid,
	parameters: {
		controls: { expanded: true },
	},
};

export default meta;

const Template: StoryFn = (props) => <Grid {...props}>Hello</Grid>;

export const Default = Template.bind({});
Default.args = {};
