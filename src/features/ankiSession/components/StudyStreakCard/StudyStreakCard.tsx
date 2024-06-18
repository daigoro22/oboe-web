import { Flex } from "@/components/elements/Flex";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnkiSessionDrawer } from "@/features/ankiSession/components/AnkiSessionDrawer";
import { CalendarDays } from "lucide-react";
import * as React from "react";

export type StudyStreakCardProps = { streak: number };
export const StudyStreakCard = ({ streak }: StudyStreakCardProps) => {
  return (
    <Card>
      <CardHeader className="px-3 pt-3 pb-2">
        <Flex
          direction="row"
          gap="md"
          alignItems="center"
          justifyContent="between"
        >
          <CardTitle className="text-xs font-normal">学習継続日数</CardTitle>
          <CalendarDays className="w-4 h-4" />
        </Flex>
      </CardHeader>
      <CardContent className="pt-0 px-3 pb-3">
        <Flex
          direction="row"
          gap="md"
          alignItems="center"
          justifyContent="between"
        >
          <p className="text-xl align-bottom font-semibold leading-none">
            {streak} 日
          </p>
          <AnkiSessionDrawer deck={{ id: 1, name: "test" }}>
            <Button className="text-xs px-3 py-1 h-5" variant="outline">
              学習
            </Button>
          </AnkiSessionDrawer>
        </Flex>
      </CardContent>
    </Card>
  );
};
