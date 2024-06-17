import type { Meta, StoryFn } from "@storybook/react";
import React from "react";

import { ResumeErrorModal } from "./ResumeErrorModal";
import {
  reactRouterParameters,
  withRouter,
} from "storybook-addon-remix-react-router";

const meta = {
  title: "Components/ResumeErrorModal",
  render: () => <ResumeErrorModal />,
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

const Template: StoryFn = (props) => <ResumeErrorModal {...props} />;

export const Default = Template.bind({});
Default.args = {};
