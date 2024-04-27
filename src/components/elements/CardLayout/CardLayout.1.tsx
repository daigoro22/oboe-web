import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";
import * as React from "react";
import type { CardLayoutProps } from "./CardLayout";

export const CardLayout = (props: CardLayoutProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>aaaa</CardTitle>
				<CardDescription>aaa</CardDescription>
			</CardHeader>

			<CardContent> CardLayout</CardContent>
		</Card>
	);
};
