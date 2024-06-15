import { Button } from "@/components/ui/button";
import type { cards } from "@/db/schema";
import {
  isErrorResponse,
  ratingAtom,
  resumeSessionAtom,
  targetCardNumAtom,
} from "@/features/ankiSession/atoms/ankiSessionAtom";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import * as React from "react";
import type { Rating } from "ts-fsrs";
export type RatingButtonProps = {
  ratingLabel: string;
  ratingValue: Rating;
} & React.ComponentProps<typeof Button>;
export const RatingButton = ({
  ratingLabel,
  ratingValue,
  ...props
}: RatingButtonProps) => {
  const setRating = useSetAtom(ratingAtom);
  const [targetCardNum, setTargetCardNum] = useAtom(targetCardNumAtom);
  const resumeSession = useAtomValue(resumeSessionAtom);
  const cards = isErrorResponse(resumeSession.data)
    ? []
    : resumeSession?.data?.cards ?? [];
  const targetCardPublicId = cards[targetCardNum]?.publicId;
  const ratingCallback = React.useCallback(() => {
    setRating({ rating: ratingValue, cardPublicId: targetCardPublicId });
    setTargetCardNum((prev) =>
      prev + 1 < cards.length ? prev + 1 : cards.length - 1,
    );
  }, [
    setRating,
    setTargetCardNum,
    cards.length,
    targetCardPublicId,
    ratingValue,
  ]);

  return (
    <Button
      variant="outline"
      className="text-xs px-3 py-1 h-5"
      onClick={ratingCallback}
      {...props}
    >
      {ratingLabel}
    </Button>
  );
};
