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
      sm: "gap-3",
      md: "gap-4",
      lg: "gap-5",
      xl: "gap-6",
    },
  },
  defaultVariants: {
    direction: "row",
    gap: "sm",
  },
});

export const Flex = ({ children, direction, gap }: FlexProps) => (
  <div className={flex({ direction, gap })}>{children}</div>
);
