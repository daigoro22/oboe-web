import { MetricCard } from "@/components/elements/MetricCard";
import { Button } from "@/components/ui/button";
import { getUsersAtom } from "@/features/misc/atoms/usersAtom";
import { useAtomValue } from "jotai";
import { Coins } from "lucide-react";
import * as React from "react";

export type UserPointsCardProps = {};
export const UserPointsCard = (props: UserPointsCardProps) => {
  const { data } = useAtomValue(getUsersAtom);
  const point = data?.point ?? 0;

  return (
    <MetricCard
      title="ポイント残高"
      icon={<Coins className="w-4 h-4" />}
      desc={`${point} pt`}
      buttonText="購入"
    />
  );
};
