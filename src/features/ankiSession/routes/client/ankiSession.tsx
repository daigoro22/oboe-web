import { CardLayout } from "@/components/elements/CardLayout";
import { Flex } from "@/components/elements/Flex";
import { Grid } from "@/components/elements/Grid";
import { GridContainer } from "@/components/elements/GridContainer";
import { useResumeSession } from "@/features/ankiSession/api/resumeAnkiSession";
import { AbortButton } from "@/features/ankiSession/components/AbortButton";
import { FlashCard } from "@/features/ankiSession/components/FlashCard";
import { RatingButton } from "@/features/ankiSession/components/RatingButton";
import { StreetView } from "@/features/ankiSession/components/StreetView";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

export const AnkiSession = () => {
  const { id } = useParams();
  const { mutateAsync, data } = useResumeSession(id ?? "", () => {});

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    void (async () => await mutateAsync(undefined))();
    console.log(data);
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
                position={{ lat: 40.729884, lng: -73.990988 }}
                pov={{ heading: 265, pitch: 0 }}
              />
            </div>
            <FlashCard
              front="aaa"
              back="bbb"
              flip={flip}
              onClick={() => setFlip(!flip)}
            />
            <Flex direction="row" justifyContent="between" gap="xs">
              <RatingButton text="やり直し" />
              <RatingButton text="難しい" />
              <RatingButton text="まあまあ" />
              <RatingButton text="簡単" />
            </Flex>
          </Flex>
        </CardLayout>
        <AbortButton className="mt-6" />
      </GridContainer>
    </Grid>
  );
};
