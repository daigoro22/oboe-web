import { Flex } from "@/components/elements/Flex";
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
  apiCallAllowedAtom,
  getSessionAtom,
  isErrorResponse,
} from "@/features/ankiSession/atoms/ankiSessionAtom";
import { ANKI_SESSION_RESUME_LIMIT } from "@/lib/constant";
import { useAtomValue, useSetAtom } from "jotai";
import * as React from "react";
import { useNavigate } from "react-router-dom";
// biome-ignore lint/complexity/noBannedTypes: <explanation></explanation>
export type ConfirmResumeModalProps = {};
export const ConfirmResumeModal = (props: ConfirmResumeModalProps) => {
  const setApiCallAllowed = useSetAtom(apiCallAllowedAtom);
  const { data: d } = useAtomValue(getSessionAtom);
  const data = isErrorResponse(d) ? undefined : d;
  React.useEffect(() => {
    if (data) {
      setApiCallAllowed(data?.resumeCount < 1);
    }
  }, [setApiCallAllowed, data]);

  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();

  return (
    <AlertDialog
      open={open && (data?.resumeCount ?? 0) > 0}
      onOpenChange={setOpen}
    >
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent onEscapeKeyDown={(event) => event.preventDefault()}>
          <AlertDialogTitle>セッション復帰</AlertDialogTitle>
          <AlertDialogDescription>
            復帰しますか？ 残り復帰回数：
            {ANKI_SESSION_RESUME_LIMIT -
              (!isErrorResponse(data) ? data?.resumeCount ?? 0 : 0)}
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
  );
};
