import { Grid } from "@/components/elements/Grid/Grid";
import type * as React from "react";
export type GridContainerProps = React.PropsWithChildren; // eslint-disable-next-line @typescript-eslint/no-unused-vars export
export const GridContainer = ({ children }: GridContainerProps) => {
  return <div className="col-span-4">{children}</div>;
};
