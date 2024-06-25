import { MetricCard } from "@/components/elements/MetricCard";
import { Button } from "@/components/ui/button";
import { AnkiSessionDrawer } from "@/features/misc/components/AnkiSessionDrawer";
import { CalendarDays } from "lucide-react";
import * as React from "react";

export type StudyStreakCardProps = {};
export const StudyStreakCard = (props: StudyStreakCardProps) => {
  // TODO: pointFrom, pointTo, deck, streak を取得もしくは form 入力
  return (
    <MetricCard
      title="学習継続日数"
      icon={<CalendarDays className="w-4 h-4" />}
      desc="1 日"
      buttonParent={AnkiSessionDrawer}
      buttonText="学習"
    />
  );
};
