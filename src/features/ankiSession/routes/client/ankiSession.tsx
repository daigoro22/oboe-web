import { CardLayout } from "@/components/elements/CardLayout";
import { Flex } from "@/components/elements/Flex";
import { Grid } from "@/components/elements/Grid";
import { GridContainer } from "@/components/elements/GridContainer";
import {
  isErrorResponse,
  idAtom,
  ratingAtomPrimitive,
  resumeSessionAtom,
} from "@/features/ankiSession/atoms/ankiSessionAtom";
import { AbortButton } from "@/features/ankiSession/components/AbortButton";
import { FlashCard } from "@/features/ankiSession/components/FlashCard";
import { RatingButton } from "@/features/ankiSession/components/RatingButton";
import { StreetView } from "@/features/ankiSession/components/StreetView";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Rating } from "ts-fsrs";

export const AnkiSession = () => {
  const { id } = useParams();
  const setRating = useSetAtom(ratingAtomPrimitive);
  const setId = useSetAtom(idAtom);

  const { data: d } = useAtomValue(resumeSessionAtom);
  useEffect(() => {
    void (async () => {
      if (!isErrorResponse(d)) {
        setRating(
          (d?.cards ?? []).map((card) => ({
            rating: 0,
            cardPublicId: card.publicId,
          })),
        );
      }
      setId(id ?? "");
    })();
  }, [d, setRating, setId, id]);

  return (
    <Grid className="h-svh">
      <GridContainer className="h-full">
        <CardLayout title="暗記セッション">
          <Flex className="h-3/4" direction="col" gap="xl">
            <div className="h-1/2 w-full">
              <StreetView />
            </div>
            <FlashCard />
            <Flex direction="row" justifyContent="between" gap="xs">
              <RatingButton ratingLabel="やり直し" ratingValue={Rating.Again} />
              <RatingButton ratingLabel="難しい" ratingValue={Rating.Hard} />
              <RatingButton ratingLabel="まあまあ" ratingValue={Rating.Good} />
              <RatingButton ratingLabel="簡単" ratingValue={Rating.Easy} />
            </Flex>
          </Flex>
        </CardLayout>
        <AbortButton className="mt-6" />
      </GridContainer>
    </Grid>
  );
};
