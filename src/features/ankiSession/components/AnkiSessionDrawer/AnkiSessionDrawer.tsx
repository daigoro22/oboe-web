import { Flex } from "@/components/elements/Flex";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ArrowBigRight } from "lucide-react";
import type * as React from "react";

const Point = ({
  point,
}: React.PropsWithChildren<{
  point: number;
}>) => (
  <Flex direction="col" gap="xs" alignItems="center">
    <p className="text-2xl">{point}</p>
    <p className="text-xs text-muted-foreground">pt</p>
  </Flex>
);

export type AnkiSessionDrawerProps = {
  pointFrom: number;
  pointTo: number;
  deck: { id: string; name: string };
};
export const AnkiSessionDrawer = ({
  pointFrom,
  pointTo,
  deck: { id, name },
}: AnkiSessionDrawerProps) => {
  return (
    <Drawer>
      <DrawerTrigger>Open</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>暗記セッション</DrawerTitle>
          <DrawerDescription>
            ポイントを消費して暗記セッションを開始します
          </DrawerDescription>
        </DrawerHeader>
        <Flex direction="col" alignItems="center">
          <p className="text-base">デッキ名：{name}</p>
          <Flex direction="row" alignItems="center">
            <Point point={pointFrom} />
            <ArrowBigRight />
            <Point point={pointTo} />
          </Flex>
        </Flex>
        <DrawerFooter>
          <Button>開始</Button>
          <DrawerClose asChild>
            <Button variant="outline">キャンセル</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
