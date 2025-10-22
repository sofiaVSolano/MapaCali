/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  LayerGroup,
} from "react-leaflet";
import L, { PathOptions } from "leaflet";
import "leaflet.heat";

import "leaflet/dist/leaflet.css";
import * as turf from "@turf/turf";
import { Button } from "antd";
import ModalComunaInfo from "../modals/ModalComunaInfo";
import CreateMarkerModal from "../modals/CreateMarkerModal";
import CreateImageMarkerModal, { ImageMarkerData } from "../modals/CreateImageMarkerModal";
import InfoBox from "../modals/Infobox";
import FilterMenu from "../../../FilterMenu/pages/FilterMenu";
import SavedMarkersPanel from "../modals/SavedMarkersPanel";
import {
  CommuneMarkerCounts,
  ComunaProperties,
  MarkerData,
} from "../../../../services/types";
import { getListaMarcadores } from "../../../../services/mapita/mapitaAPI";
import ReactDOMServer from "react-dom/server";
import "./styles.css";
import "../modals/modals.css";

import {
  FaHospital,
  FaSchool,
  FaClinicMedical,
  FaShoppingCart,
  FaCamera,
  FaHotel,
  FaBuilding,
  FaBus,
  FaHandHoldingWater,
} from "react-icons/fa";
import { PiIslandFill, PiParkBold } from "react-icons/pi";
import { BsBank2, BsEvStationFill } from "react-icons/bs";
import { IoSchoolSharp } from "react-icons/io5";
import { MdLocalMovies } from "react-icons/md";
import { MdLocalPolice } from "react-icons/md";

import { MdElectricCar } from "react-icons/md";
import { CgGym } from "react-icons/cg";
import { GiColombia } from "react-icons/gi";
import { IoLibrary } from "react-icons/io5";
import { FaRoadBarrier } from "react-icons/fa6";
import HeatmapLayer from "./mapita";

export const Mapa: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [filteredMarkers, setFilteredMarkers] = useState<MarkerData[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [geoJsonDataColor, setGeoJsonDataColor] = useState<any>(null);

  const [showBoundaries, setShowBoundaries] = useState<boolean>(false);
  const [showColors, setShowColors] = useState<boolean>(false);
  const [showHomicidios, setShowHomicidios] = useState<boolean>(false);
  const [showHomicidios2023, setShowHomicidios2023] = useState<boolean>(false);

  const [showRobos2019, setShowRobos2019] = useState<boolean>(false);
  const [showRobos2020, setShowRobos2020] = useState<boolean>(false);

  const [showAccidentesA2018, setshowAccidentesA2018] =
    useState<boolean>(false);
  const [showAccidentesA2019, setShowAccidentesA2019] =
    useState<boolean>(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleCrearM, setIsModalVisibleCrearM] = useState(false);
  const [isModalVisibleImageMarker, setIsModalVisibleImageMarker] = useState(false);
  const [isSavedMarkersPanelVisible, setIsSavedMarkersPanelVisible] = useState(false);

  const [selectedComuna, setSelectedComuna] = useState<
    ComunaProperties | undefined
  >(undefined);
  const [imageMarkers, setImageMarkers] = useState<ImageMarkerData[]>([]);
  const [showCicloRuta, setShowCicloRuta] = useState<boolean>(false);
  const [showRios, setShowRios] = useState<boolean>(false);

  const [cicloRutaGeoJson, setCiclorutaGeoJson] = useState<any>(null);
  const [RiosGeoJson, setRiosGeoJson] = useState<any>(null);

  const [counts, setCounts] = useState<CommuneMarkerCounts>({});

  const handleAddMarker = (newMarker: MarkerData) => {
    const updatedMarkers = [...markers, newMarker];
    setMarkers(updatedMarkers);
    
    // Guardar en localStorage como backup
    try {
      const savedMarkers = localStorage.getItem('customMarkers');
      const customMarkers = savedMarkers ? JSON.parse(savedMarkers) : [];
      customMarkers.push(newMarker);
      localStorage.setItem('customMarkers', JSON.stringify(customMarkers));
      console.log('%cMarcador guardado en localStorage', 'color:green;font-weight:bold');
    } catch (error) {
      console.error('Error al guardar marcador en localStorage:', error);
    }
  };

  const handleAddImageMarker = (newImageMarker: ImageMarkerData) => {
    const updatedImageMarkers = [...imageMarkers, newImageMarker];
    setImageMarkers(updatedImageMarkers);
    
    // Guardar en localStorage
    try {
      localStorage.setItem('imageMarkers', JSON.stringify(updatedImageMarkers));
      console.log('%cMarcador de imagen guardado en localStorage', 'color:blue;font-weight:bold');
    } catch (error) {
      console.error('Error al guardar marcador de imagen en localStorage:', error);
    }
  };

  const [heatmapData, setHeatmapData] = useState([]);
  const [heatmapDataH2023, setHeatmapDataH2023] = useState([]);
  const [heatmapDataR2019, setHeatmapDataR2019] = useState([]);
  const [heatmapDataR2020, setHeatmapDataR2020] = useState([]);
  const [heatmapDataAA2018, setHeatmapDataAA2018] = useState([]);
  const [heatmapDataAA2019, setHeatmapDataAA2019] = useState([]);




  useEffect(() => {
    // Cargar marcadores de imagen desde localStorage
    try {
      const savedImageMarkers = localStorage.getItem('imageMarkers');
      if (savedImageMarkers) {
        setImageMarkers(JSON.parse(savedImageMarkers));
        console.log('%cMarcadores de imagen cargados desde localStorage', 'color:blue;font-weight:bold');
      }
    } catch (error) {
      console.error('Error al cargar marcadores de imagen desde localStorage:', error);
    }

    const fetchGeoJson = async () => {
      try {
        getListaMarcadores();

        const comunasResponse = await fetch("/public/Data/comunasCoo.geojson");
        const comunasData = await comunasResponse.json();
        setGeoJsonData(comunasData);
        setGeoJsonDataColor(comunasData);

        const normalizeAndScale = (
          value: number,
          maxValue: number,
          scaleMin = 10,
          scaleMax = 100
        ) => {
          const normalized = value / maxValue;

          return Math.max(normalized * scaleMax, scaleMin);
        };

        const maxIntensity2022 = Math.max(
          ...comunasData.features.map(
            (feature: { properties: { [x: string]: any } }) =>
              feature.properties["homicidios2022"] || 0
          )
        );

        const heatData2022 = comunasData.features
          .filter((feature: { geometry: { type: string; }; }) => feature.geometry?.type === "Polygon")
          .map((feature: { geometry: { coordinates: any[]; }; properties: { [x: string]: number; }; }) => {
            const coordinates = feature.geometry.coordinates[0];
            const centroid = calculateCentroid(coordinates);
            const intensity2022 = feature.properties["homicidios2022"] || 0;

            const areaKm2 = calculateArea(coordinates);

            const normalizedRadius = Math.max(
              (intensity2022 / maxIntensity2022) * areaKm2 * 100,
              10 
            );

            return [centroid[1], centroid[0], normalizedRadius];
          });

        // const maxIntensity2023 = Math.max(
        //   ...comunasData.features.map(
        //     (feature: { properties: { [x: string]: any } }) =>
        //       feature.properties["homicidios2023"] || 0
        //   )
        // );

        const heatData2023 = comunasData.features
          .filter(
            (feature: { geometry: { type: string } }) =>
              feature.geometry?.type === "Polygon"
          )
          .map(
            (feature: {
              geometry: { coordinates: any[] };
              properties: { [x: string]: number };
            }) => {
              const coordinates = feature.geometry.coordinates[0];
              const centroid = calculateCentroid(coordinates);
              const intensity2023 = feature.properties["homicidios2023"] || 0;

              
            const areaKm2 = calculateArea(coordinates);

            const normalizedRadius = Math.max(
              (intensity2023 / maxIntensity2022) * areaKm2 * 100,
              10 
            );

              return [centroid[1], centroid[0], normalizedRadius];
            }
          );

        const maxIntensityRobos2018 = Math.max(
          ...comunasData.features.map(
            (feature: { properties: { [x: string]: any } }) =>
              feature.properties["hurto2018"] || 0
          )
        );

        const heatDataRobos2018 = comunasData.features
          .filter(
            (feature: { geometry: { type: string } }) =>
              feature.geometry?.type === "Polygon"
          )
          .map(
            (feature: {
              geometry: { coordinates: any[] };
              properties: { [x: string]: number };
            }) => {
              const coordinates = feature.geometry.coordinates[0];
              const centroid = calculateCentroid(coordinates);
              const intensityH2018 = feature.properties["hurto2018"] || 0;

              const normalizedRadius = normalizeAndScale(
                intensityH2018,
                maxIntensityRobos2018, // Máximo de hurtos 2018
                10,
                100
              );

              return [centroid[1], centroid[0], normalizedRadius];
            }
          );

        const maxIntensityRobos2019 = Math.max(
          ...comunasData.features.map(
            (feature: { properties: { [x: string]: any } }) =>
              feature.properties["hurto2019"] || 0
          )
        );

        const heatDataRobos2019 = comunasData.features
          .filter(
            (feature: { geometry: { type: string } }) =>
              feature.geometry?.type === "Polygon"
          )
          .map(
            (feature: {
              geometry: { coordinates: any[] };
              properties: { [x: string]: number };
            }) => {
              const coordinates = feature.geometry.coordinates[0];
              const centroid = calculateCentroid(coordinates);
              const intensityH2019 = feature.properties["hurto2019"] || 0;

              const normalizedRadius = normalizeAndScale(
                intensityH2019,
                maxIntensityRobos2019,
                10,
                100
              );

              return [centroid[1], centroid[0], normalizedRadius];
            }
          );

        const maxIntensityAccidentes2018 = Math.max(
          ...comunasData.features.map(
            (feature: { properties: { [x: string]: any } }) =>
              feature.properties["accidenteT2018"] || 0
          )
        );

        const headDataAccidentesA2018 = comunasData.features
          .filter(
            (feature: { geometry: { type: string } }) =>
              feature.geometry?.type === "Polygon"
          )
          .map(
            (feature: {
              geometry: { coordinates: any[] };
              properties: { [x: string]: number };
            }) => {
              const coordinates = feature.geometry.coordinates[0];
              const centroid = calculateCentroid(coordinates);
              const intensityAu2018 = feature.properties["accidenteT2018"] || 0;

              const normalizedRadius = normalizeAndScale(
                intensityAu2018,
                maxIntensityAccidentes2018, // Máximo de accidentes 2018
                10,
                100
              );

              return [centroid[1], centroid[0], normalizedRadius];
            }
          );

        const maxIntensityAccidentes2019 = Math.max(
          ...comunasData.features.map(
            (feature: { properties: { [x: string]: any } }) =>
              feature.properties["accidenteT2018"] || 0
          )
        );

        const headDataAccidentesA2019 = comunasData.features
          .filter(
            (feature: { geometry: { type: string } }) =>
              feature.geometry?.type === "Polygon"
          )
          .map(
            (feature: {
              geometry: { coordinates: any[] };
              properties: { [x: string]: number };
            }) => {
              const coordinates = feature.geometry.coordinates[0];
              const centroid = calculateCentroid(coordinates);
              const intensityAu2019 = feature.properties["accidenteT2019"] || 0;

              const normalizedRadius = normalizeAndScale(
                intensityAu2019,
                maxIntensityAccidentes2019, // Máximo de accidentes 2019
                10,
                100
              );

              return [centroid[1], centroid[0], normalizedRadius];
            }
          );

        setHeatmapData(heatData2022);
        setHeatmapDataH2023(heatData2023);
        setHeatmapDataR2019(heatDataRobos2018);
        setHeatmapDataR2020(heatDataRobos2019);
        setHeatmapDataAA2018(headDataAccidentesA2018);
        setHeatmapDataAA2019(headDataAccidentesA2019);

        console.log("Homicidios 2022:", heatData2022);
        console.log("Hurto 2018:", heatDataRobos2018);
        console.log("Accidentes 2019:", headDataAccidentesA2019);

        const riosResponse = await fetch("/public/Data/rios.geojson");
        const riosData = await riosResponse.json();
        setRiosGeoJson(riosData);

        const ciclorutaResponse = await fetch("public/Data/cicloRuta.geojson");
        const ciclorutaData = await ciclorutaResponse.json();
        setCiclorutaGeoJson(ciclorutaData);
      } catch (error) {
        console.error("Error al cargar los archivos GeoJSON:", error);
      }
    };

    const calculateArea = (coordinates: any[]): number => {
      const polygon = turf.polygon([coordinates]);
      const area = turf.area(polygon); // Área en m²
      return area / 1e6; // Convertir a km²
    };

    const calculateCentroid = (coordinates: [any, any][]) => {
      if (!coordinates || coordinates.length === 0) return [0, 0];

      let latSum = 0;
      let lngSum = 0;

      coordinates.forEach(([lng, lat]) => {
        latSum += lat;
        lngSum += lng;
      });

      const centroid = [
        lngSum / coordinates.length,
        latSum / coordinates.length,
      ];
      return centroid;
    };

    const fetchData = async () => {
      try {
        const responseAPI = await getListaMarcadores();
        const allMarkers: MarkerData[] = [];

        if (Array.isArray(responseAPI.data)) {
          responseAPI.data.forEach((row: any) => {
            const lat = parseFloat(row.latitud);
            const lng = parseFloat(row.longitud);
            if (!isNaN(lat) && !isNaN(lng)) {
              allMarkers.push({
                nombre: row.nombre || "Nombre desconocido",
                tipo: row.tipo || "Sin categoría",
                lat: lat,
                lng: lng,
              });
            }
          });
        } else {
          console.warn("La respuesta de la API no es un array");
        }

        // Agregar marcadores personalizados desde localStorage
        try {
          const savedMarkers = localStorage.getItem('customMarkers');
          if (savedMarkers) {
            const customMarkers = JSON.parse(savedMarkers);
            allMarkers.push(...customMarkers);
            console.log('%cMarcadores personalizados cargados desde localStorage', 'color:green;font-weight:bold');
          }
        } catch (error) {
          console.error('Error al cargar marcadores personalizados desde localStorage:', error);
        }

        setMarkers(allMarkers);
        console.log(markers);
      } catch (error) {
        console.error("Error al cargar los marcadores desde la API:", error);
      }
    };

    fetchGeoJson();
    fetchData();
  }, []);

  const onOpenModal = (comuna: ComunaProperties) => {
    setSelectedComuna(comuna);
    setIsModalVisible(true);
  };

  const boundaryStyle: (
    feature?: GeoJSON.Feature<GeoJSON.Geometry, ComunaProperties>
  ) => PathOptions = (feature) => {
    if (!feature || !feature.properties) {
      return { color: "red", weight: 10, opacity: 2.0 }; // Default style
    }

    const isSelected =
      selectedComuna && selectedComuna.comuna === feature.properties.comuna;

    return {
      color: isSelected ? "black" : "black", // Line color
      weight: 3,
      opacity: 1.8,
      fillColor: isSelected ? "rgba(0, 0, 139, 0.6)" : undefined, // Fill color for the selected comuna
      fillOpacity: isSelected ? 0.9 : 0, // Make it opaque if selected
    };
  };

  const getIconByCategory = (category: string) => {
    let iconComponent = <FaBuilding size={15} color="brown" />; // Ícono por defecto

    switch (category.toLowerCase()) {
      case "hospitales":
        iconComponent = <FaHospital size={20} color="yellow" />;
        break;
      case "colegio":
        iconComponent = <FaSchool size={20} color="blue" />;
        break;
      case "estaciones mio":
        iconComponent = <FaBus size={20} color="black" />;
        break;
      case "clinicas":
        iconComponent = <FaClinicMedical size={20} color="white" />;
        break;
      case "bancos":
        iconComponent = <BsBank2 size={20} color="#B8860B" />;
        break;
      case "universidades":
        iconComponent = <IoSchoolSharp size={20} color="#FF007F" />;
        break;
      case "centros comerciales":
        iconComponent = <FaShoppingCart size={20} color="orange" />;
        break;
      case "estaciones electricas":
        iconComponent = <MdElectricCar size={20} color="orange" />;
        break;
      case "monumentos":
        iconComponent = <GiColombia size={20} color="purple" />;
        break;
      case "unidades deportivas":
        iconComponent = <CgGym size={20} color="red" />;
        break;
      case "fotomultas":
        iconComponent = <FaCamera size={20} color="orange" />;
        break;
      case "humedales":
        iconComponent = <PiIslandFill size={20} color="green" />;
        break;
      case "parques":
        iconComponent = <PiParkBold size={20} color="green" />;
        break;
      case "comunas":
        iconComponent = <FaBuilding size={20} color="black" />;
        break;
      case "hoteles":
        iconComponent = <FaHotel size={20} color="red" />;
        break;
      case "biblioteca":
        iconComponent = <IoLibrary size={20} color="yellow" />;
        break;
      case "gasolinerias":
        iconComponent = <BsEvStationFill size={20} color="blue" />;
        break;
      case "cines":
        iconComponent = <MdLocalMovies size={20} color="purple" />;
        break;
      case "cais":
        iconComponent = <MdLocalPolice size={20} color="green" />;
        break;
      case "hueco":
        iconComponent = <FaRoadBarrier size={20} color="black" />;
        break;
      
      case "ptap":
        iconComponent = <FaHandHoldingWater size={20} color="red" />;
        break;

      default:
        iconComponent = <FaBuilding size={20} color="brown" />;
        break;
    }

    const iconHtml = ReactDOMServer.renderToString(iconComponent);

    return new L.DivIcon({
      html: `<div class="custom-icon">${iconHtml}</div>`,
      className: "custom-icon-container",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });
  };

  useEffect(() => {
    // Si no hay tipos seleccionados, mostrar todos los marcadores
    if (selectedTypes.size === 0) {
      setFilteredMarkers(markers);
    } else {
      setFilteredMarkers(
        markers.filter((marker) => selectedTypes.has(marker.tipo))
      );
    }
  }, [selectedTypes, markers]);

  const handleToggleCategoryFromLegend = (category: string) => {
    const newSelectedTypes = new Set(selectedTypes);
    
    if (newSelectedTypes.has(category)) {
      // Si ya está seleccionado, lo quitamos
      newSelectedTypes.delete(category);
    } else {
      // Si no está seleccionado, lo agregamos
      newSelectedTypes.add(category);
    }
    
    setSelectedTypes(newSelectedTypes);
    console.log(
      "%cToggled category from legend:",
      "color:purple;font-size:14px",
      category,
      "Active categories:",
      Array.from(newSelectedTypes)
    );
  };

  const handleToggleBoundaries = (checked: boolean) => {
    setShowBoundaries(checked);
  };

  const handleToggleCicloRuta = (checked: boolean) => {
    setShowCicloRuta(checked);
  };

  const handleToggleRios = (Checked: boolean) => {
    setShowRios(Checked);
  };

  const handleToggleColor = (checked: boolean) => {
    setShowColors(checked);
  };

  const handleToggleHomicidios = (checked: boolean) => {
    setShowHomicidios(checked);
  };

  const handleToggleHomicidios2023 = (checked: boolean) => {
    setShowHomicidios2023(checked);
  };

  const handleToggleRobos2019 = (checked: boolean) => {
    setShowRobos2019(checked);
  };

  const handleToggleRobos2020 = (checked: boolean) => {
    setShowRobos2020(checked);
  };

  const handleToggleAccidentesA2018 = (checked: boolean) => {
    setshowAccidentesA2018(checked);
  };

  const handleToggleAccidentesA2019 = (checked: boolean) => {
    setShowAccidentesA2019(checked);
  };

  //metodo hacer clic cada comuna
  const onEachFeatureInfo = (feature: any, layer: any) => {
    layer.on({
      click: () => {
        const comuna = feature.properties.comuna;
        const poblacion = feature.properties.poblacion;
        const viviendas = feature.properties.viviendas;
        const estratoModa = feature.properties.estratoModa;
        const establecimientos = feature.properties.establecimientos;
        const centrosSalud = feature.properties.centrosSalud;
        const puestosSalud = feature.properties.puestosSalud;
        const establecimientosSecundaria =
          feature.properties.establecimientosSecundaria;
        const establecimientosPrimaria =
          feature.properties.establecimientosPrimaria;
        const establecimientosPreescolar =
          feature.properties.establecimientosPreescolar;
        const bibliotecas = feature.properties.bibliotecas;
        const hoteles = feature.properties.hoteles;
        const seguridad = feature.properties.seguridad;
        const homicidios = feature.properties.homicidios;
        const hurtos = feature.properties.hurtos;
        const suicidios = feature.properties.suicidios;

        if (comuna) {
          // Llama a comunaClick con los datos de la comuna
          onOpenModal({
            comuna,
            poblacion,
            viviendas,
            estratoModa,
            establecimientos,
            centrosSalud,
            puestosSalud,
            establecimientosSecundaria,
            establecimientosPreescolar,
            establecimientosPrimaria,
            bibliotecas,
            hoteles,
            seguridad,
            homicidios,
            hurtos,
            suicidios,
          });
        }
      },
    });
  };

  const getMostCommonType = (counts: { [markerType: string]: number }) => {
    let maxCount = 0;
    let mostCommonType = "";

    // Itera sobre cada tipo de marcador y encuentra el que tiene el mayor conteo
    Object.entries(counts).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonType = type;
      }
    });

    const totalMarkers = Object.values(counts).reduce(
      (acc, count) => acc + count,
      0
    );
    return totalMarkers <= 3 ? "default" : mostCommonType;
  };

  const assignMarkersToCommunes = useCallback(
    (markers: MarkerData[], geoJsonData: any): CommuneMarkerCounts => {
      const counts: CommuneMarkerCounts = {};

      geoJsonData.features.forEach((feature: any) => {
        const communeName: string = feature.properties.comuna;
        const polygon = turf.polygon(feature.geometry.coordinates);

        counts[communeName] = counts[communeName] || {};

        markers.forEach((marker) => {
          const point = turf.point([marker.lng, marker.lat]);

          // Verificar si el marcador está dentro del polígono de la comuna
          if (turf.booleanPointInPolygon(point, polygon)) {
            const type = marker.tipo;

            // Inicializar el contador para este tipo de marcador si no existe
            counts[communeName][type] = (counts[communeName][type] || 0) + 1;
          }
        });
      });

      return counts;
    },
    []
  );

  useEffect(() => {
    if (geoJsonData && markers.length > 0) {
      const calculatedCounts = assignMarkersToCommunes(markers, geoJsonData);
      setCounts(calculatedCounts); // Actualiza el estado con el conteo de marcadores por comuna
    }
  }, [geoJsonData, markers, assignMarkersToCommunes]);

  // Función para obtener el color según el tipo de marcador
  const getColorByType = (type: string) => {
    switch (type.toLowerCase()) {
      case "hospitales":
        return "yellow";
      case "universidades":
        return "pink";
      case "centros comerciales":
        return "orange";
      case "fotomultas":
        return "green";
      case "monumentos":
        return "purple";
      case "colegios":
        return "blue";
      case "bancos":
        return "#b8860b";
      case "hoteles":
        return "red";
      default:
        return "gray"; // Color por defecto
    }
  };

  const geoJsonStyle = (feature: any) => {
    const communeName = feature.properties.comuna;
    const mostCommonType = getMostCommonType(counts[communeName] || {}); // Asegúrate de manejar si no hay datos
    const color = getColorByType(mostCommonType);

    return {
      fillColor: color,
      weight: 2,
      opacity: 1,
      color: "black",
      fillOpacity: 0.3,
    };
  };

  return (
    <div style={{ 
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      height: "100vh", 
      width: "100vw",
      margin: 0,
      padding: 0,
      overflow: "hidden"
    }}>
      {/* Botones flotantes para abrir los modales */}
      <div className="floating-buttons-container">
        <Button
          className="floating-button floating-button-primary"
          onClick={() => setIsModalVisibleCrearM(true)}
          icon={<span style={{ fontSize: "18px" }}>📍</span>}
        >
          Crear Marcador
        </Button>
        <Button
          className="floating-button floating-button-success"
          onClick={() => setIsModalVisibleImageMarker(true)}
          icon={<span style={{ fontSize: "18px" }}>📸</span>}
        >
          Agregar Imagen
        </Button>
        <Button
          className="floating-button floating-button-info"
          onClick={() => setIsSavedMarkersPanelVisible(true)}
          icon={<span style={{ fontSize: "18px" }}>📋</span>}
        >
          Ver Guardados
        </Button>
      </div>

      <CreateMarkerModal
        isVisible={isModalVisibleCrearM}
        onCreate={handleAddMarker}
        onClose={() => setIsModalVisibleCrearM(false)}
      />

      <CreateImageMarkerModal
        isVisible={isModalVisibleImageMarker}
        onCreate={handleAddImageMarker}
        onClose={() => setIsModalVisibleImageMarker(false)}
      />

      <SavedMarkersPanel
        visible={isSavedMarkersPanelVisible}
        onClose={() => setIsSavedMarkersPanelVisible(false)}
      />

      <FilterMenu
        onToggleBoundaries={handleToggleBoundaries}
        onToggleColors={handleToggleColor}
        showBoundaries={showBoundaries}
        showColors={showColors}
        showCicloRuta={showCicloRuta}
        onToggleCicloRutas={handleToggleCicloRuta}
        showRios={showRios}
        onToggleRios={handleToggleRios}
        showHomicidios={showHomicidios}
        showHomicidios2023={showHomicidios2023}
        onToggleHomicidios={handleToggleHomicidios}
        onToggleHomicidios2023={handleToggleHomicidios2023}
        showRobos2019={showRobos2019}
        showRobos2020={showRobos2020}
        onToggleRobos2019={handleToggleRobos2019}
        onToggleRobos2020={handleToggleRobos2020}
        showAccidentesA2018={showAccidentesA2018}
        showAccidentesA2019={showAccidentesA2019}
        onToggleAccidentesA2018={handleToggleAccidentesA2018}
        onToggleAccidentesA2019={handleToggleAccidentesA2019}
      />
      <MapContainer
        center={[3.4516, -76.532]}
        id="map"
        zoom={12}
        style={{ 
          height: "100%", 
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        {showCicloRuta && cicloRutaGeoJson && (
          <GeoJSON
            data={cicloRutaGeoJson}
            style={{ color: "red", weight: 3 }}
          />
        )}
        {showHomicidios && geoJsonData && (
          <HeatmapLayer data={heatmapData}></HeatmapLayer>
        )}
        {showHomicidios2023 && geoJsonData && (
          <HeatmapLayer data={heatmapDataH2023}></HeatmapLayer>
        )}
        {showRobos2019 && geoJsonData && (
          <HeatmapLayer data={heatmapDataR2019}></HeatmapLayer>
        )}
        {showRobos2020 && geoJsonData && (
          <HeatmapLayer data={heatmapDataR2020}></HeatmapLayer>
        )}
        {showAccidentesA2018 && geoJsonData && (
          <HeatmapLayer data={heatmapDataAA2018}></HeatmapLayer>
        )}
        {showAccidentesA2019 && geoJsonData && (
          <HeatmapLayer data={heatmapDataAA2019}></HeatmapLayer>
        )}
        {showRios && RiosGeoJson && (
          <GeoJSON
            data={RiosGeoJson}
            style={{ color: "blue", weight: 3 }}
            onEachFeature={(feature, layer) => {
              if (feature.properties && feature.properties.name) {
                layer.bindPopup(`${feature.properties.name}`);
              }
            }}
          />
        )}
        {/* colores marcadores populares */}
        {geoJsonData && showBoundaries && (
          <GeoJSON
            data={geoJsonData}
            style={geoJsonStyle}
            onEachFeature={(feature, layer) => {
              const communeName = feature.properties.comuna;
              const communeCounts = counts[communeName] || {};

              layer.bindTooltip(
                `<div style="font-size: 12px; padding: 5px;">
                  <span style="font-weight: bold;">${communeName}</span>
                  <ul style="padding-left: 0; margin: 5px 0 0 0; list-style-type: none;">
                    ${Object.entries(communeCounts)
                      .map(
                        ([type, count]) =>
                          `<li style="margin: 2px 0;">${type}: ${count}</li>`
                      )
                      .join("")}
                  </ul>
                </div>`,
                { sticky: true, direction: "auto", opacity: 0.6 }
              );

              layer.on({
                mouseover: () => layer.openTooltip(),
                mouseout: () => layer.closeTooltip(),
              });
            }}
          />
        )}
        {/* limites de las comunas y modal */}
        <InfoBox 
          visible={showBoundaries} 
          selectedTypes={selectedTypes}
          onToggleCategory={handleToggleCategoryFromLegend}
        />
        {geoJsonDataColor && showColors && (
          <GeoJSON
            data={geoJsonDataColor}
            style={boundaryStyle}
            onEachFeature={onEachFeatureInfo}
          />
        )}
        <ModalComunaInfo
          selectedComuna={selectedComuna || undefined} // Si selectedComuna es null, se pasa undefined
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
        {/* Renderizar los marcadores filtrados */}
        <LayerGroup>
          {filteredMarkers.map((marker, index) => (
            <Marker
              key={index}
              position={[marker.lat, marker.lng]}
              icon={getIconByCategory(marker.tipo)}
            >
              <Popup>{marker.nombre}</Popup>
            </Marker>
          ))}
        </LayerGroup>

        {/* Renderizar las imágenes en el mapa */}
        <LayerGroup>
          {imageMarkers.map((imageMarker, index) => {
            const imageIcon = new L.Icon({
              iconUrl: imageMarker.imageUrl,
              iconSize: [50, 50],
              iconAnchor: [25, 25],
              popupAnchor: [0, -25],
              className: 'image-marker-icon'
            });

            return (
              <Marker
                key={`image-${index}`}
                position={[imageMarker.lat, imageMarker.lng]}
                icon={imageIcon}
              >
                <Popup maxWidth={300}>
                  <div style={{ textAlign: 'center' }}>
                    {imageMarker.nombre && (
                      <h4 style={{ marginBottom: '10px' }}>{imageMarker.nombre}</h4>
                    )}
                    <img 
                      src={imageMarker.imageUrl} 
                      alt={imageMarker.nombre || 'Imagen'}
                      style={{ 
                        width: '100%', 
                        maxWidth: '250px',
                        borderRadius: '8px'
                      }}
                    />
                    <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                      Lat: {imageMarker.lat.toFixed(6)}, Lng: {imageMarker.lng.toFixed(6)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </LayerGroup>
      </MapContainer>
    </div>
  );
};

export default Mapa;
