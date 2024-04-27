import type * as React from "react";
export type GridProps = React.PropsWithChildren<{}>; // eslint-disable-next-line @typescript-eslint/no-unused-vars export
export const Grid = ({ children }: GridProps) => {
	return <div className="grid grid-cols-4 gap-[2.5rem]">{children}</div>;
};
