import { CardLayout } from "@/components/elements/CardLayout";
import { Flex } from "@/components/elements/Flex";
import { Grid } from "@/components/elements/Grid";
import { GridContainer } from "@/components/elements/GridContainer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  isErrorResponse,
  idAtom,
  ratingAtomPrimitive,
  resumeSessionAtom,
  apiCallAllowedAtom,
} from "@/features/ankiSession/atoms/ankiSessionAtom";
import { AbortButton } from "@/features/ankiSession/components/AbortButton";
import { FlashCard } from "@/features/ankiSession/components/FlashCard";
import { RatingButton } from "@/features/ankiSession/components/RatingButton";
import { StreetView } from "@/features/ankiSession/components/StreetView";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Rating } from "ts-fsrs";

export const AnkiSession = () => {
  const { id } = useParams();
  const setRating = useSetAtom(ratingAtomPrimitive);
  const setApiCallAllowed = useSetAtom(apiCallAllowedAtom);
  const setId = useSetAtom(idAtom);

  const { data } = useAtomValue(resumeSessionAtom);
  useEffect(() => {
    void (async () => {
      if (!isErrorResponse(data)) {
        setRating(
          (data?.cards ?? []).map((card) => ({
            rating: 0,
            cardPublicId: card.publicId,
          })),
        );
      }
      setId(id ?? "");
    })();
  }, [data, setRating, setId, id]);

  useEffect(() => {
    const openDialog = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", openDialog);
    return () => {
      window.removeEventListener("beforeunload", openDialog);
    };
  }, []);

  const [open, setOpen] = useState(false);
  const referer = document.referrer;
  useEffect(() => {
    const isFromSamePage = referer === window.location.href;
    setApiCallAllowed(!isFromSamePage);
    setOpen(isFromSamePage);
  }, [referer, setApiCallAllowed]);

  const navigate = useNavigate();

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogPortal>
          <AlertDialogOverlay />
          <AlertDialogContent
            onEscapeKeyDown={(event) => event.preventDefault()}
          >
            <AlertDialogTitle>セッション復帰</AlertDialogTitle>
            <AlertDialogDescription>
              復帰しますか？
              {/* TODO:（残り復帰回数：
              {ANKI_SESSION_RESUME_LIMIT -
                (!isErrorResponse(data) ? data?.session?.resumeCount ?? 0 : 0)}
              ） */}
            </AlertDialogDescription>
            <Flex
              direction="row"
              justifyContent="center"
              gap="md"
              alignItems="end"
            >
              <AlertDialogAction onClick={() => setApiCallAllowed(true)}>
                復帰
              </AlertDialogAction>
              <AlertDialogCancel
                onClick={() => {
                  navigate("/");
                }}
              >
                キャンセル
              </AlertDialogCancel>
            </Flex>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>

      <Grid className="h-svh">
        <GridContainer className="h-full">
          <CardLayout title="暗記セッション">
            <Flex className="h-3/4" direction="col" gap="xl">
              <div className="h-1/2 w-full">
                <StreetView />
              </div>
              <FlashCard />
              <Flex direction="row" justifyContent="between" gap="xs">
                <RatingButton
                  ratingLabel="やり直し"
                  ratingValue={Rating.Again}
                />
                <RatingButton ratingLabel="難しい" ratingValue={Rating.Hard} />
                <RatingButton
                  ratingLabel="まあまあ"
                  ratingValue={Rating.Good}
                />
                <RatingButton ratingLabel="簡単" ratingValue={Rating.Easy} />
              </Flex>
            </Flex>
          </CardLayout>
          <AbortButton className="mt-6" />
        </GridContainer>
      </Grid>
    </>
  );
};
