import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet.heat";
import { useMap } from "react-leaflet";

type HeatmapData = Array<[number, number, number?]>;

interface HeatmapLayerProps {
  data: HeatmapData;
}

const HeatmapLayer: React.FC<HeatmapLayerProps> = ({ data }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Sanitizar datos: solo puntos con números finitos
    const safeData: HeatmapData = (Array.isArray(data) ? data : [])
      .filter(
        (p): p is [number, number, number?] =>
          Array.isArray(p) && p.length >= 2 &&
          Number.isFinite(Number(p[0])) && Number.isFinite(Number(p[1]))
      )
      .map(([lat, lng, intensity]) => [Number(lat), Number(lng), intensity]) as HeatmapData;

  let heatLayer: L.Layer | undefined;

    const init = () => {
      try {
        const layer = (L as any).heatLayer(
          safeData.map(([lat, lng, intensity]) => [lat, lng, intensity]),
          {
            blur: 15,
            max: 1,
            // radius lo dejamos por punto (intensity) para permitir tamaño dinámico
          }
        ) as L.Layer;
        layer.addTo(map);
        heatLayer = layer;
      } catch (err) {
        console.error("Error inicializando capa de calor:", err);
      }
    };

    // Si el mapa ya está listo, inicializar; si no, esperar al evento 'load'
    if ((map as any)._loaded) {
      init();
    } else {
      map.once("load", init);
    }

    return () => {
      try {
        if (heatLayer && (map as any).hasLayer?.(heatLayer)) {
          map.removeLayer(heatLayer);
        }
      } catch (err) {
        // Evitar que errores de limpieza rompan la app
        console.warn("Error removiendo capa de calor:", err);
      }
    };
  }, [data, map]);

  return null;
};

export default HeatmapLayer;
