import type { Meta, StoryFn } from "@storybook/react";
import React from "react";

import { Grid } from "@/components/elements/Grid";
import { GridContainer } from "./GridContainer";

const meta: Meta = {
  title: "Components/GridContainer",
  component: GridContainer,
  parameters: {
    controls: { expanded: true },
  },
  tags: ["autodocs"],
};

export default meta;

const Template: StoryFn = (props) => (
  <Grid>
    <GridContainer {...props}>Hello</GridContainer>
  </Grid>
);

export const Default = Template.bind({});
Default.args = {};
