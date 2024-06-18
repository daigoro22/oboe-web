import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAtomValue } from "jotai";
import { resumeSessionAtom } from "@/features/ankiSession/atoms/ankiSessionAtom";

const Core = React.lazy(
  () => import("@/features/ankiSession/components/StreetView/Core"),
);

export const StreetView = () => {
  const { isSuccess } = useAtomValue(resumeSessionAtom);

  return !isSuccess ? (
    <Skeleton className="w-full h-full" /> //TODO: Suspense 使いたいな
  ) : (
    <Core />
  );
};
