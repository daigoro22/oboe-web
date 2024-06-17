import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  idAtom,
  isErrorResponse,
  gradeAtom,
  resumeSessionAtom,
  targetCardNumAtom,
} from "@/features/ankiSession/atoms/ankiSessionAtom";
import type { AnkiSessionRoute } from "@/features/ankiSession/routes/server/ankiSession/ankiSession.controller";
import { useMutation } from "@tanstack/react-query";
import { hc } from "hono/client";
import { useAtom, useAtomValue } from "jotai";
import * as React from "react";
import { useNavigate } from "react-router-dom";
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
  const [grade, setGrade] = useAtom(gradeAtom);
  const [targetCardNum, setTargetCardNum] = useAtom(targetCardNumAtom);
  const resumeSession = useAtomValue(resumeSessionAtom);
  const data = isErrorResponse(resumeSession.data)
    ? undefined
    : resumeSession.data;
  const cards = data?.cards ?? [];
  const targetCardPublicId = cards[targetCardNum]?.publicId;
  const client = hc<AnkiSessionRoute>("/");
  const id = useAtomValue(idAtom);
  const navigate = useNavigate();
  const endSession = useMutation({
    mutationFn: async (
      data: Omit<
        Parameters<
          (typeof client.api.auth.verified.ankiSession)[":id"]["$put"]
        >[0],
        "param"
      >,
    ) => {
      await client.api.auth.verified.ankiSession[":id"].$put({
        ...data,
        param: { id },
      });
    },
    onSuccess(_, variables) {
      toast({
        title: "暗記セッション完了",
        description: `${variables.json.cards.length}枚のカードを暗記しました！`,
      });
      navigate("/");
    },
    onError(data) {
      toast({
        title: "暗記セッションが完了できませんでした",
        description: data.message,
      });
    },
  });

  const ratingCallback = React.useCallback(() => {
    const currentGrade = {
      grade: ratingValue,
      cardPublicId: targetCardPublicId,
    };
    if (targetCardNum + 1 < cards.length) {
      setGrade(currentGrade);
      setTargetCardNum((prev) => prev + 1);
    } else {
      void (async () =>
        await endSession.mutate({
          json: {
            deckPublicId: data?.deck.publicId ?? "",
            cards: [
              ...grade.filter(
                ({ cardPublicId }) => cardPublicId !== targetCardPublicId,
              ),
              currentGrade,
            ],
          },
        }))();
    }
  }, [
    setGrade,
    setTargetCardNum,
    endSession.mutate,
    targetCardNum,
    data?.deck.publicId,
    grade,
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
