import { CardLayout } from "@/components/elements/CardLayout";
import { Flex } from "@/components/elements/Flex";
import { Grid } from "@/components/elements/Grid";
import { GridContainer } from "@/components/elements/GridContainer";
import { useResumeSession } from "@/features/ankiSession/api/resumeAnkiSession";
import { AbortButton } from "@/features/ankiSession/components/AbortButton";
import { FlashCard } from "@/features/ankiSession/components/FlashCard";
import { RatingButton } from "@/features/ankiSession/components/RatingButton";
import { StreetView } from "@/features/ankiSession/components/StreetView";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export const AnkiSession = () => {
  const { id } = useParams();
  const resumeSession = useResumeSession(id ?? "", () => {});

  useEffect(() => {
    void (async () => await resumeSession.mutateAsync(undefined))();
    console.log(resumeSession.data);
  }, [resumeSession]);

  return (
    <Grid>
      <GridContainer>
        <CardLayout title="暗記セッション">
          <Flex direction="col" gap="xs">
            <StreetView apiKey="" />
            <FlashCard front="aaa" back="bbb" />
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
