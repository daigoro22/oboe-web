import { Button } from "@/components/ui/button";
import { BookOpenCheck } from "lucide-react";
import * as React from "react";

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type AbortButtonProps = {};
export const AbortButton = (props: AbortButtonProps) => {
  return (
    <Button variant="destructive" className="flex gap-2">
      <BookOpenCheck className="w-4 h-4" />
      学習を終了する
    </Button>
  );
};
