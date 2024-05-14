import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as React from "react";
export type FlashCardProps = { front: string; back: string; flip: boolean };
export const FlashCard = ({ front, back, flip }: FlashCardProps) => {
  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>{flip ? back : front}</CardTitle>
      </CardHeader>
    </Card>
  );
};
