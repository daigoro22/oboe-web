import { Flex } from "@/components/elements/Flex";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import * as React from "react";
// biome-ignore lint/complexity/noBannedTypes: <explanation></explanation>
export type StudyStreakCardProps = { streak: number };
export const StudyStreakCard = ({ streak }: StudyStreakCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2.5">
        <Flex direction="row" gap="md" alignItems="center">
          <CardTitle className="text-xs font-normal">学習継続日数</CardTitle>
          <CalendarDays className="w-4 h-4" />
        </Flex>
      </CardHeader>
      <CardContent>
        <Flex direction="row" gap="md" alignItems="center">
          <p className="text-xl align-bottom font-semibold leading-none">
            {streak} 日
          </p>
          <Button variant="outline">学習</Button>
        </Flex>
      </CardContent>
    </Card>
  );
};
