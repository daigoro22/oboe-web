/**
 * Do not edit directly
 * Generated on Mon, 29 Apr 2024 12:42:10 GMT
 */

export default tokens;

declare interface DesignToken {
	value: any;
	name?: string;
	comment?: string;
	themeable?: boolean;
	attributes?: {
		category?: string;
		type?: string;
		item?: string;
		subitem?: string;
		state?: string;
		[key: string]: any;
	};
	[key: string]: any;
}

declare const tokens: {
	primitive: {
		palette: {
			black: {
				"50": DesignToken;
				"100": DesignToken;
				"200": DesignToken;
				"300": DesignToken;
				"400": DesignToken;
				"500": DesignToken;
				"600": DesignToken;
				"700": DesignToken;
				"800": DesignToken;
				"900": DesignToken;
			};
			white: {
				"50": DesignToken;
				"100": DesignToken;
				"200": DesignToken;
				"300": DesignToken;
				"400": DesignToken;
				"500": DesignToken;
				"600": DesignToken;
				"700": DesignToken;
				"800": DesignToken;
				"900": DesignToken;
			};
			blue: {
				"50": DesignToken;
				"100": DesignToken;
				"200": DesignToken;
				"300": DesignToken;
				"400": DesignToken;
				"500": DesignToken;
				"600": DesignToken;
				"700": DesignToken;
				"800": DesignToken;
				"900": DesignToken;
			};
			red: {
				"50": DesignToken;
				"100": DesignToken;
				"200": DesignToken;
				"300": DesignToken;
				"400": DesignToken;
				"500": DesignToken;
				"600": DesignToken;
				"700": DesignToken;
				"800": DesignToken;
				"900": DesignToken;
			};
		};
		size: {
			xs: DesignToken;
			sm: DesignToken;
			md: DesignToken;
			lg: DesignToken;
			xl: DesignToken;
			xxxl: DesignToken;
			xxl: DesignToken;
		};
	};
	semantic: {
		color: {
			"bg-primary": DesignToken;
			input: DesignToken;
			"bg-white": DesignToken;
			"primary-dark": DesignToken;
			"primary-light": DesignToken;
			"text-white": DesignToken;
			"text-main": DesignToken;
			"alert-light": DesignToken;
			"alert-dark": DesignToken;
			"accent-light": DesignToken;
			"accent-dark": DesignToken;
			"text-sub": DesignToken;
			"text-disabled": DesignToken;
			"text-placeholder": DesignToken;
			"text-link": DesignToken;
			"text-link-sub": DesignToken;
			border: DesignToken;
			"bg-gray": DesignToken;
			"bg-accent": DesignToken;
			"bg-alert": DesignToken;
		};
		spacing: {
			"main-margin-horizontal": DesignToken;
			"main-margin-vertical": DesignToken;
			"main-gap": DesignToken;
			"grid-gutter": DesignToken;
			"menu-margin-horizontal": DesignToken;
		};
		radius: {
			section: DesignToken;
		};
	};
};
