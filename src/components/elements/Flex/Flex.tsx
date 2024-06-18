import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

export type FlexProps = React.PropsWithChildren<
  VariantProps<typeof flex> & React.ComponentProps<"div">
>;
const flex = cva("flex", {
  variants: {
    direction: {
      row: "flex-row",
      col: "flex-col",
    },
    gap: {
      xs: "gap-1",
      sm: "gap-3",
      md: "gap-4",
      lg: "gap-5",
      xl: "gap-6",
    },
    alignItems: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
    },
    justifyContent: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
    },
  },
  defaultVariants: {
    direction: "row",
    gap: "sm",
  },
});

export const Flex = ({
  children,
  direction,
  gap,
  alignItems,
  justifyContent,
  className,
  ...props
}: FlexProps) => (
  <div
    className={cn(
      className,
      flex({ direction, gap, alignItems, justifyContent }),
    )}
    {...props}
  >
    {children}
  </div>
);
