import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type * as React from "react";
export type FlashCardProps = {
  front: string;
  back: string;
  flip: boolean;
} & React.ComponentProps<typeof Card>;
export const FlashCard = ({
  front,
  back,
  flip,
  className,
  ...props
}: FlashCardProps) => {
  return (
    <Card {...props} className={cn(className, "drop-shadow-sm border")}>
      <CardHeader className="items-center">
        <CardTitle>{flip ? back : front}</CardTitle>
      </CardHeader>
    </Card>
  );
};
