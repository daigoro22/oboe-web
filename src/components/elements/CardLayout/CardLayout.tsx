import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type * as React from "react";
export type CardLayoutProps = React.PropsWithChildren<
  {
    title: string;
    desc?: string;
  } & React.ComponentProps<typeof Card>
>; // eslint-disable-next-line @typescript-eslint/no-unused-vars export

export const CardLayout = ({
  children,
  title,
  desc,
  className,
  ...props
}: CardLayoutProps) => {
  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {desc ? <CardDescription>{desc}</CardDescription> : null}
      </CardHeader>
      <CardContent className="p-4 pt-0"> {children}</CardContent>
    </Card>
  );
};
