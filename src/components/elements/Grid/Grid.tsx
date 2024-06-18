import { cn } from "@/lib/utils";
import type * as React from "react";
export type GridProps = React.PropsWithChildren<React.ComponentProps<"div">>; // eslint-disable-next-line @typescript-eslint/no-unused-vars export
export const Grid = ({ children, className, ...props }: GridProps) => {
  return (
    <div
      className={cn(className, "grid grid-cols-4 gap-5 px-8 mt-6")}
      {...props}
    >
      {children}
    </div>
  );
};
