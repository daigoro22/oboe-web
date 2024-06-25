import type { Meta, StoryFn } from "@storybook/react";
import React from "react";

import { StudyStreakCard } from "./StudyStreakCard";

const meta: Meta = {
  title: "Components/StudyStreakCard",
  component: StudyStreakCard,
  parameters: {
    controls: { expanded: true },
  },
  tags: ["autodocs"],
};

export default meta;

const Template: StoryFn = (props) => (
  <StudyStreakCard {...props}>Hello</StudyStreakCard>
);

export const Default = Template.bind({});
Default.args = { streak: 22 };
