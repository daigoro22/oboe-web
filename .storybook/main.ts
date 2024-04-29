import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: [
		"@storybook/addon-onboarding",
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@chromatic-com/storybook",
		"@storybook/addon-interactions",
		"@storybook/addon-mdx-gfm",
		"@storybook/addon-backgrounds",
	],
	core: {
		builder: {
			name: "@storybook/builder-vite",
			options: {
				viteConfigPath: "vite.config.storybook.ts",
			},
		},
	},
	framework: "@storybook/react-vite",
	docs: {
		autodocs: "tag",
	},
};
export default config;
