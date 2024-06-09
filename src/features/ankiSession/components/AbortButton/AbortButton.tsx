import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookOpenCheck } from "lucide-react";
import * as React from "react";

export type AbortButtonProps = {} & ButtonProps;
export const AbortButton = (props: AbortButtonProps) => {
  return (
    <Button
      {...props}
      variant="destructive"
      className={cn("flex gap-2 px-3 py-1", props.className)}
    >
      <BookOpenCheck className="w-4 h-4" />
      学習を終了する
    </Button>
  );
};
