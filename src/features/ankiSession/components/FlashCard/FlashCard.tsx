import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  isErrorResponse,
  resumeSessionAtom,
  targetCardNumAtom,
} from "@/features/ankiSession/atoms/ankiSessionAtom";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";
import * as React from "react";
import { useParams } from "react-router-dom";
export type FlashCardProps = {} & React.ComponentProps<typeof Card>;
export const FlashCard = ({ className, ...props }: FlashCardProps) => {
  const { data: d } = useAtomValue(resumeSessionAtom);
  const data = isErrorResponse(d) ? undefined : d;
  const targetCardNum = useAtomValue(targetCardNumAtom);
  const [flip, setFlip] = React.useState(false);

  return (
    <Card
      {...props}
      className={cn(className, "drop-shadow-sm border")}
      onClick={() => setFlip(!flip)}
    >
      <CardHeader className="items-center">
        <CardTitle>
          {flip
            ? data?.cards[targetCardNum]?.backContent
            : data?.cards[targetCardNum]?.frontContent}
        </CardTitle>
      </CardHeader>
    </Card>
  );
};
