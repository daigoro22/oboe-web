import type { Meta, StoryFn } from '@storybook/react';
import React from "react";

import { PurchaseList } from './PurchaseList';

const meta: Meta = {
  title: 'Components/PurchaseList',
  component: PurchaseList,
  parameters: {
    controls: { expanded: true },
  },
	tags: ["autodocs"],
};

export default meta;

const Template: StoryFn = (props) => <PurchaseList {...props}>Hello</PurchaseList>;

export const Default = Template.bind({});
Default.args = {};
