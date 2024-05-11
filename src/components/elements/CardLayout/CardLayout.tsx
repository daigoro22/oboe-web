import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type * as React from "react";
export type CardLayoutProps = React.PropsWithChildren<{
  title: string;
  desc: string;
}>; // eslint-disable-next-line @typescript-eslint/no-unused-vars export

export const CardLayout = ({ children, title, desc }: CardLayoutProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent> {children}</CardContent>
    </Card>
  );
};
