import type { Meta, StoryFn } from "@storybook/react";
import React from "react";

import { FlashCard } from "./FlashCard";

const meta: Meta = {
  title: "Components/FlashCard",
  component: FlashCard,
  parameters: {
    controls: { expanded: true },
  },
  tags: ["autodocs"],
};

export default meta;

const Template: StoryFn = (props) => <FlashCard {...props}>Hello</FlashCard>;

export const Default = Template.bind({});
Default.args = {
  front: "鎌倉幕府が開かれた年は？",
  back: "1192年",
  flip: false,
};
