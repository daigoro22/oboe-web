import { Button } from "@/components/ui/button";
import * as React from "react";
export type RatingButtonProps = { text: string };
export const RatingButton = ({ text }: RatingButtonProps) => {
  return <Button variant="outline">{text}</Button>;
};
