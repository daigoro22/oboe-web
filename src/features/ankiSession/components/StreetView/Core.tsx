import {
  isErrorResponse,
  resumeSessionAtom,
  targetCardNumAtom,
} from "@/features/ankiSession/atoms/ankiSessionAtom";
import {
  APIProvider,
  useMap,
  Map as GoogleMap,
} from "@vis.gl/react-google-maps";
import { useAtomValue } from "jotai";
import React from "react";

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

export default function Core() {
  const apiKey = React.useMemo(
    () => import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    [],
  );
  const { data: d } = useAtomValue(resumeSessionAtom);
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

  return (
    <APIProvider apiKey={apiKey}>
      <View position={position} pov={pov} />
    </APIProvider>
  );
}
