import type { Meta, StoryFn } from "@storybook/react";
import React from "react";

import { PurchaseModal } from "./PurchaseModal";
import { Button } from "@/components/ui/button";

const meta: Meta = {
  title: "Components/PurchaseModal",
  component: PurchaseModal,
  parameters: {
    controls: { expanded: true },
  },
  tags: ["autodocs"],
};

export default meta;

const Template: StoryFn = (props) => (
  <PurchaseModal {...props}>Hello</PurchaseModal>
);

export const Default = Template.bind({});
Default.args = { triggerButton: <Button>open</Button> };
