import type { Meta, StoryFn } from "@storybook/react";
import React from "react";

import { StreetView } from "./StreetView";

const meta: Meta = {
  title: "Components/StreetView",
  component: StreetView,
  parameters: {
    controls: { expanded: true },
  },
  tags: ["autodocs"],
};

export default meta;

const Template: StoryFn = (props) => (
  <div className="h-96 w-96">
    <StreetView {...props} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  position: { lat: 40.729884, lng: -73.990988 },
  pov: {
    heading: 265,
    pitch: 0,
  },
};
