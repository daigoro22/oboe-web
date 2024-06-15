import { Button } from "@/components/ui/button";
import type * as React from "react";
export type RatingButtonProps = { text: string } & React.ComponentProps<
  typeof Button
>;
export const RatingButton = ({ text, ...props }: RatingButtonProps) => {
  return (
    <Button variant="outline" className="text-xs px-3 py-1 h-5" {...props}>
      {text}
    </Button>
  );
};
