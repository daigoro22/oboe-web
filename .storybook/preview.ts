import type { Preview } from "@storybook/react";
import "../src/globals.css";

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		backgrounds: {
			default: "default",
			values: [
				{
					name: "default",
					value: "#EDF0F7",
				},
			],
		},
	},
};
export default preview;
