import type { Meta, StoryFn } from "@storybook/react";
import React from "react";

import { Logo } from "@/components/elements/Logo";
import { Flex } from "./Flex";

const meta: Meta = {
  title: "Components/Flex",
  component: Flex,
  parameters: {
    controls: { expanded: true },
  },
  tags: ["autodocs"],
};

export default meta;

const Template: StoryFn = (props) => (
  <Flex {...props}>
    <>
      <Logo />
      <Logo />
    </>
  </Flex>
);

export const Default = Template.bind({});
Default.args = { direction: "row", gap: "md" };
