import type { Meta, StoryFn } from '@storybook/react';
import React from "react";

import { UserPointsCard } from './UserPointsCard';

const meta: Meta = {
  title: 'Components/UserPointsCard',
  component: UserPointsCard,
  parameters: {
    controls: { expanded: true },
  },
	tags: ["autodocs"],
};

export default meta;

const Template: StoryFn = (props) => <UserPointsCard {...props}>Hello</UserPointsCard>;

export const Default = Template.bind({});
Default.args = {};
