import * as React from "react";
import {
  APIProvider,
  Map as GoogleMap,
  useMap,
} from "@vis.gl/react-google-maps";
import {
  isErrorResponse,
  resumeSessionAtom,
} from "@/features/ankiSession/atoms/ankiSessionAtom";
import { useAtomValue } from "jotai";
import { targetCardNumAtom } from "@/features/ankiSession/atoms/ankiSessionAtom";
import { Skeleton } from "@/components/ui/skeleton";

export type StreetViewProps = {
  position: { lat: number; lng: number };
  pov: { heading: number; pitch: number };
};

const View = ({ position, pov }: StreetViewProps) => {
  const map = useMap("main");
  const panorama = map?.getStreetView();
  panorama?.setPosition(position);
  panorama?.setPov(pov);
  panorama?.setVisible(true);

  return (
    <GoogleMap
      id="main"
      defaultZoom={3}
      defaultCenter={{ lat: 0, lng: 0 }}
      gestureHandling="none"
      disableDefaultUI={true}
    />
  );
};

export const StreetView = () => {
  const apiKey = React.useMemo(
    () => import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    [],
  );
  const { data: d, isSuccess } = useAtomValue(resumeSessionAtom);
  const data = isErrorResponse(d) ? undefined : d;
  const targetCardNum = useAtomValue(targetCardNumAtom);

  const position = {
    lat: data?.cards[targetCardNum]?.lat ?? 0,
    lng: data?.cards[targetCardNum]?.lng ?? 0,
  };

  const pov = {
    heading: data?.cards[targetCardNum]?.heading ?? 0,
    pitch: data?.cards[targetCardNum]?.pitch ?? 0,
  };

  return !isSuccess ? (
    <Skeleton className="w-full h-full" /> //TODO: Suspense 使いたいな
  ) : (
    <APIProvider apiKey={apiKey}>
      <View position={position} pov={pov} />
    </APIProvider>
  );
};
