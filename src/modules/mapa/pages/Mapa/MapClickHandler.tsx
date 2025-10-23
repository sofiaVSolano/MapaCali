import { useMapEvents } from 'react-leaflet';

interface MapClickHandlerProps {
  enabled: boolean;
  onMapClick: (lat: number, lng: number) => void;
}

const MapClickHandler: React.FC<MapClickHandlerProps> = ({ enabled, onMapClick }) => {
  useMapEvents({
    click: (e) => {
      if (enabled) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

export default MapClickHandler;
