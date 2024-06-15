import { CardLayout } from "@/components/elements/CardLayout";
import { Flex } from "@/components/elements/Flex";
import { Grid } from "@/components/elements/Grid";
import { GridContainer } from "@/components/elements/GridContainer";
import { useResumeSession } from "@/features/ankiSession/api/resumeAnkiSession";
import { AbortButton } from "@/features/ankiSession/components/AbortButton";
import { FlashCard } from "@/features/ankiSession/components/FlashCard";
import { RatingButton } from "@/features/ankiSession/components/RatingButton";
import { StreetView } from "@/features/ankiSession/components/StreetView";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Rating } from "ts-fsrs";

const isErrorResponse = (response: unknown): response is { error: string } => {
  if (
    typeof response === "object" &&
    response !== null &&
    "error" in response
  ) {
    return true;
  }
  return false;
};

export const AnkiSession = () => {
  const { id } = useParams();

  const [data, setData] = useState<
    | Exclude<
        Awaited<
          ReturnType<
            NonNullable<ReturnType<typeof useResumeSession>["data"]>["json"]
          >
        >,
        { error: string }
      >
    | undefined
  >();
  const [targetCardNum, setTargetCardNum] = useState<number>(0);
  const [rating, setRating] = useState<
    {
      rating: Rating;
      cardPublicId: string;
    }[]
  >([]);

  const { mutateAsync } = useResumeSession(id ?? "", async (d) => {
    const _data = await d.json();
    if (isErrorResponse(_data)) {
      setData(undefined);
    } else {
      setData(_data);
      setRating(
        _data.cards.map((card) => ({
          rating: 0,
          cardPublicId: card.publicId,
        })),
      );
    }
  });

  const cards = data?.cards ?? [];
  const cardDict = cards.reduce(
    (acc, card) => {
      acc[card.publicId] = card;
      return acc;
    },
    {} as Record<string, (typeof cards)[number]>,
  );
  const deck = data?.deck;
  const session = data?.session;
  const targetCardPublicId = cards[targetCardNum]?.publicId;

  const ratingCallback = useCallback(
    (rating: Rating) => {
      return () => {
        setRating((prevRatings) => {
          return prevRatings.map((item) =>
            item.cardPublicId === targetCardPublicId
              ? { ...item, rating: rating }
              : item,
          );
        });
        setTargetCardNum((prev) =>
          prev + 1 < cards.length ? prev + 1 : cards.length - 1,
        );
      };
    },
    [targetCardPublicId, cards.length],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    void (async () => await mutateAsync(undefined))();
  }, []);

  const apiKey = useMemo(() => import.meta.env.VITE_GOOGLE_MAPS_API_KEY, []);

  const [flip, setFlip] = useState(false);

  return (
    <Grid className="h-svh">
      <GridContainer className="h-full">
        <CardLayout title="暗記セッション">
          <Flex className="h-3/4" direction="col" gap="xl">
            <div className="h-1/2 w-full">
              <StreetView
                apiKey={apiKey}
                position={{
                  lat: cardDict[targetCardPublicId]?.lat,
                  lng: cardDict[targetCardPublicId]?.lng,
                }}
                pov={{
                  heading: cardDict[targetCardPublicId]?.heading,
                  pitch: cardDict[targetCardPublicId]?.pitch,
                }}
              />
            </div>
            <FlashCard
              front={cardDict[targetCardPublicId]?.frontContent}
              back={cardDict[targetCardPublicId]?.backContent}
              flip={flip}
              onClick={() => setFlip(!flip)}
            />
            <Flex direction="row" justifyContent="between" gap="xs">
              <RatingButton
                text="やり直し"
                onClick={ratingCallback(Rating.Again)}
              />
              <RatingButton
                text="難しい"
                onClick={ratingCallback(Rating.Hard)}
              />
              <RatingButton
                text="まあまあ"
                onClick={ratingCallback(Rating.Good)}
              />
              <RatingButton text="簡単" onClick={ratingCallback(Rating.Easy)} />
            </Flex>
          </Flex>
        </CardLayout>
        <AbortButton className="mt-6" />
      </GridContainer>
    </Grid>
  );
};
