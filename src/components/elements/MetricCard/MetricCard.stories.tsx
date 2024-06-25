import type { Meta, StoryFn } from "@storybook/react";
import React from "react";

import { MetricCard } from "./MetricCard";

const meta: Meta = {
  title: "Components/MetricCard",
  component: MetricCard,
  parameters: {
    controls: { expanded: true },
  },
  tags: ["autodocs"],
};

export default meta;

const Template: StoryFn = (props) => <MetricCard {...props}>Hello</MetricCard>;

export const Default = Template.bind({});
Default.args = {};
