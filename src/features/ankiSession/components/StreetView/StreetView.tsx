import type * as React from "react";
import {
  APIProvider,
  Map as GoogleMap,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

export type StreetViewProps = {
  apiKey: string;
  position: { lat: number; lng: number };
  pov: { heading: number; pitch: number };
};

const View = ({ position, pov }: Omit<StreetViewProps, "apiKey">) => {
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

export const StreetView = ({ apiKey, position, pov }: StreetViewProps) => {
  return (
    <APIProvider apiKey={apiKey}>
      <View position={position} pov={pov} />
    </APIProvider>
  );
};
