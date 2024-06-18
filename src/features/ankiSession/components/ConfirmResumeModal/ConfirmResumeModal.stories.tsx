import type { StoryFn } from "@storybook/react";
import React from "react";

import { ConfirmResumeModal } from "./ConfirmResumeModal";
import {
  reactRouterParameters,
  withRouter,
} from "storybook-addon-remix-react-router";

const meta = {
  title: "Components/ConfirmResumeModal",
  render: () => <ConfirmResumeModal />,
  parameters: {
    controls: { expanded: true },
  },
  tags: ["autodocs"],
  decorators: [withRouter],
  reactRouter: reactRouterParameters({
    routing: { path: "/anki-sessions/1" },
  }),
};
export default meta;

const Template: StoryFn = (props) => {
  return <ConfirmResumeModal {...props}>Hello</ConfirmResumeModal>;
};

export const Default = Template.bind({});
Default.args = {};
