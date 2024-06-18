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
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookOpenCheck } from "lucide-react";
import * as React from "react";
import { useNavigate } from "react-router-dom";

export type AbortButtonProps = {} & ButtonProps;
export const AbortButton = (props: AbortButtonProps) => {
  const [abortOpen, setAbortOpen] = React.useState(false);
  const navigate = useNavigate();

  return (
    <>
      <AlertDialog open={abortOpen} onOpenChange={setAbortOpen}>
        <AlertDialogPortal>
          <AlertDialogOverlay />
          <AlertDialogContent
            onEscapeKeyDown={(event) => event.preventDefault()}
          >
            <AlertDialogTitle>学習中断</AlertDialogTitle>
            <AlertDialogDescription>
              学習を中断してトップ画面に戻りますか？
            </AlertDialogDescription>
            <Flex
              direction="row"
              justifyContent="center"
              gap="md"
              alignItems="end"
            >
              <AlertDialogAction onClick={() => navigate("/")}>
                中断
              </AlertDialogAction>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
            </Flex>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>

      <Button
        {...props}
        variant="destructive"
        className={cn("flex gap-2 px-3 py-1", props.className)}
        onClick={() => setAbortOpen(true)}
      >
        <BookOpenCheck className="w-4 h-4" />
        学習を終了する
      </Button>
    </>
  );
};
