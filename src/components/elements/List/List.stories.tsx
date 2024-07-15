import type { Meta, StoryFn } from "@storybook/react";
import React from "react";

import { List } from "./List";

const meta: Meta = {
  title: "Components/List",
  component: List,
  parameters: {
    controls: { expanded: true },
  },
  tags: ["autodocs"],
};

export default meta;

const Template: StoryFn = (props) => <List {...props}>Hello</List>;

export const Default = Template.bind({});
Default.args = {
  headers: [
    { key: "header1", content: "Header 1" },
    { key: "header2", content: "Header 2" },
  ],
  rows: [
    {
      cells: [
        { key: "cell1", content: "Cell 1" },
        { key: "cell2", content: "Cell 2" },
      ],
    },
    {
      cells: [
        { key: "cell3", content: "Cell 3" },
        { key: "cell4", content: "Cell 4" },
      ],
    },
  ],
};

export const FiveColumns = Template.bind({});
FiveColumns.args = {
  headers: [
    { key: "header1", content: "Header 1" },
    { key: "header2", content: "Header 2" },
    { key: "header3", content: "Header 3" },
    { key: "header4", content: "Header 4" },
    { key: "header5", content: "Header 5" },
  ],
  rows: [
    {
      key: "row1",
      cells: [
        { key: "cell1", content: "Cell 1" },
        { key: "cell2", content: "Cell 2" },
        { key: "cell3", content: "Cell 3" },
        { key: "cell4", content: "Cell 4" },
        { key: "cell5", content: "Cell 5" },
      ],
    },
    {
      key: "row2",
      cells: [
        { key: "cell6", content: "Cell 6" },
        { key: "cell7", content: "Cell 7" },
        { key: "cell8", content: "Cell 8" },
        { key: "cell9", content: "Cell 9" },
        { key: "cell10", content: "Cell 10" },
      ],
    },
    {
      key: "row3",
      cells: [
        { key: "cell11", content: "Cell 11" },
        { key: "cell12", content: "Cell 12" },
        { key: "cell13", content: "Cell 13" },
        { key: "cell14", content: "Cell 14" },
        { key: "cell15", content: "Cell 15" },
      ],
    },
  ],
};
