import type { Meta, StoryFn } from '@storybook/react';
import React from "react";

import { AbortButton } from './AbortButton';

const meta: Meta = {
  title: 'Components/AbortButton',
  component: AbortButton,
  parameters: {
    controls: { expanded: true },
  },
	tags: ["autodocs"],
};

export default meta;

const Template: StoryFn = (props) => <AbortButton {...props}>Hello</AbortButton>;

export const Default = Template.bind({});
Default.args = {};
