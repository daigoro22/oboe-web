import type { Meta, StoryFn } from "@storybook/react";
import React from "react";

import { AnkiSessionDrawer } from "./AnkiSessionDrawer";

const meta: Meta = {
  title: "Components/AnkiSessionDrawer",
  component: AnkiSessionDrawer,
  parameters: {
    controls: { expanded: true },
  },
  tags: ["autodocs"],
};

export default meta;

const Template: StoryFn = (props) => (
  <AnkiSessionDrawer {...props}>Hello</AnkiSessionDrawer>
);

export const Default = Template.bind({});
Default.args = {
  pointFrom: 2300,
  pointTo: 2290,
  deck: { id: "1", name: "日本の地名" },
};
