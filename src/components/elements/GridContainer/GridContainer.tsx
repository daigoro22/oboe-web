import { Grid } from "@/components/elements/Grid/Grid";
import { cn } from "@/lib/utils";
import type * as React from "react";
export type GridContainerProps = React.PropsWithChildren<
  React.ComponentProps<"div">
>; // eslint-disable-next-line @typescript-eslint/no-unused-vars export
export const GridContainer = ({
  children,
  className,
  ...props
}: GridContainerProps) => {
  return (
    <div className={cn(className, "col-span-4")} {...props}>
      {children}
    </div>
  );
};
