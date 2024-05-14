import type { Meta, StoryFn } from "@storybook/react";
import React from "react";

import { RatingButton } from "./RatingButton";

const meta: Meta = {
  title: "Components/RatingButton",
  component: RatingButton,
  parameters: {
    controls: { expanded: true },
  },
  tags: ["autodocs"],
};

export default meta;

const Template: StoryFn = (props) => (
  <RatingButton {...props}>Hello</RatingButton>
);

export const Default = Template.bind({});
Default.args = { text: "やり直し" };

export const Difficult = Template.bind({});
Difficult.args = { text: "難しい" };

export const Normal = Template.bind({});
Normal.args = { text: "まあまあ" };

export const Easy = Template.bind({});
Easy.args = { text: "簡単" };
