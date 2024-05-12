import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

export type FlexProps = React.PropsWithChildren<VariantProps<typeof flex>>;
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
  },
  defaultVariants: {
    direction: "row",
    gap: "sm",
    alignItems: "center",
  },
});

export const Flex = ({ children, direction, gap, alignItems }: FlexProps) => (
  <div className={flex({ direction, gap, alignItems })}>{children}</div>
);
