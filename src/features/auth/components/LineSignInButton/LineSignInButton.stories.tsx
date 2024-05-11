import type { Meta, StoryFn } from "@storybook/react";
import React from "react";

import { LineSignInButton } from "./LineSignInButton";

const meta: Meta = {
  title: "Components/LineSignInButton",
  component: LineSignInButton,
  parameters: {
    controls: { expanded: true },
  },
  tags: ["autodocs"],
};

export default meta;

const Template: StoryFn = (props) => (
  <LineSignInButton {...props}>Hello</LineSignInButton>
);

export const Default = Template.bind({});
Default.args = {};
