import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Flex } from "@/components/elements/Flex";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAtomValue } from "jotai";
import { resumeSessionAtom } from "@/features/ankiSession/atoms/ankiSessionAtom";

// biome-ignore lint/complexity/noBannedTypes: <explanation></explanation>
export type ResumeErrorModalProps = {};
export const ResumeErrorModal = (props: ResumeErrorModalProps) => {
  const { isError, error } = useAtomValue(resumeSessionAtom);
  const navigate = useNavigate();

  return (
    <AlertDialog open={isError}>
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent onEscapeKeyDown={(event) => event.preventDefault()}>
          <AlertDialogTitle>暗記セッション取得エラー</AlertDialogTitle>
          <AlertDialogDescription>{error?.message}</AlertDialogDescription>
          <Flex
            direction="row"
            justifyContent="center"
            gap="md"
            alignItems="end"
          >
            <AlertDialogAction
              onClick={() => {
                navigate("/");
              }}
            >
              トップ画面に戻る
            </AlertDialogAction>
          </Flex>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
};
