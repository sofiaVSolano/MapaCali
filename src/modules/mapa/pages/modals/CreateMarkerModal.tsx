/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect, useRef } from "react";
import { Modal, Form, Input, Button, Select, message, AutoComplete } from "antd";
import { SearchOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { MarkerData } from "../../../../services/types";
import { crearMarcadorMapa } from "../../../../services/mapita/mapitaAPI";

const CreateMarkerModal: React.FC<{
  isVisible: boolean;
  onCreate: (marker: MarkerData) => void;
  onClose: () => void;
}> = ({ isVisible, onCreate, onClose }) => {
  const [form] = Form.useForm();
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lng, setLng] = useState<number | undefined>(undefined);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchOptions, setSearchOptions] = useState<any[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const autocompleteService = useRef<any>(null);
  const placesService = useRef<any>(null);
  const mapRef = useRef<any>(null);

  // Método para crear el marcador en el mapa
  const crearMarcador= async (marker: MarkerData) => {
    marker.lat.toString();
    marker.lng.toString();

    console.log("Datos enviados a crearMarcadorMapa:", marker);
    const marqui = await crearMarcadorMapa(marker);
    console.log(marqui);
  };

  // Inicializar Google Maps Services
  useEffect(() => {
    if (isVisible && window.google) {
      try {
        // Crear servicios de Google Maps
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        
        // Crear un mapa oculto para el PlacesService
        if (!mapRef.current) {
          const mapDiv = document.createElement('div');
          mapRef.current = new window.google.maps.Map(mapDiv);
        }
        placesService.current = new window.google.maps.places.PlacesService(mapRef.current);
      } catch (error) {
        console.error('Error al inicializar Google Maps Services:', error);
        message.warning('Google Maps no está disponible. Ingresa las coordenadas manualmente.');
      }
    }
  }, [isVisible]);

  // Buscar lugares con Google Places
  const handleSearchPlace = (value: string) => {
    setSearchValue(value);
    
    if (!value || value.length < 3) {
      setSearchOptions([]);
      return;
    }

    if (!autocompleteService.current) {
      message.warning('Servicio de Google Maps no disponible');
      return;
    }

    setIsLoadingPlaces(true);

    // Configurar búsqueda centrada en Cali, Colombia
    const request = {
      input: value,
      componentRestrictions: { country: 'co' }, // Solo Colombia
      location: new window.google.maps.LatLng(3.4516, -76.532), // Cali
      radius: 50000, // 50km alrededor de Cali
    };

    autocompleteService.current.getPlacePredictions(
      request,
      (predictions: any, status: any) => {
        setIsLoadingPlaces(false);
        
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          const options = predictions.map((prediction: any) => ({
            value: prediction.description,
            label: (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <EnvironmentOutlined style={{ color: '#667eea' }} />
                <div>
                  <div style={{ fontWeight: 500 }}>{prediction.structured_formatting.main_text}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {prediction.structured_formatting.secondary_text}
                  </div>
                </div>
              </div>
            ),
            placeId: prediction.place_id,
          }));
          setSearchOptions(options);
        } else {
          setSearchOptions([]);
          if (status !== window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            message.error('Error al buscar lugares');
          }
        }
      }
    );
  };

  // Obtener detalles del lugar seleccionado
  const handleSelectPlace = (value: string, option: any) => {
    // Marcar 'value' como usado para evitar error TS6133 cuando no se necesita
    void value;
    if (!placesService.current || !option.placeId) {
      return;
    }

    const request = {
      placeId: option.placeId,
      fields: ['name', 'geometry', 'formatted_address', 'types'],
    };

    placesService.current.getDetails(request, (place: any, status: any) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();
        
        setLat(latitude);
        setLng(longitude);
        
        // Auto-completar el nombre si está vacío
        if (!form.getFieldValue('nombre')) {
          form.setFieldsValue({ nombre: place.name });
        }
        
        message.success(`📍 Ubicación encontrada: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      } else {
        message.error('No se pudo obtener los detalles del lugar');
      }
    });
  };

  // Maneja el envío del formulario
  const handleFormSubmit = (values: any) => {
    if (!lat || !lng) {
      message.error('Por favor ingresa las coordenadas del marcador');
      return;
    }

    const newMarker: MarkerData = {
      nombre: values.nombre,
      tipo: values.tipo,
      lat: lat!,
      lng: lng!,
    };

    // Llama al método de crear marcador
    crearMarcador(newMarker);

    // Llama a la función onCreate para que otros componentes se actualicen
    onCreate(newMarker);

    // Cierra el modal y resetea el formulario
    onClose();
    form.resetFields();
    setLat(undefined);
    setLng(undefined);
    setSearchValue("");
    setSearchOptions([]);
  };

  const handleCancel = () => {
    form.resetFields();
    setLat(undefined);
    setLng(undefined);
    setSearchValue("");
    setSearchOptions([]);
    onClose();
  };

  return (
    <Modal
      title={
        <span>
          <EnvironmentOutlined style={{ marginRight: 8, color: '#667eea' }} />
          Crear Nuevo Marcador
        </span>
      }
      open={isVisible}
      onCancel={handleCancel}
      footer={null}
      width={650}
    >
      <Form form={form} onFinish={handleFormSubmit} layout="vertical">
        <Form.Item
          label={
            <span>
              <SearchOutlined style={{ marginRight: 6 }} />
              Buscar lugar con Google Maps
            </span>
          }
          tooltip="Busca un lugar para obtener automáticamente las coordenadas"
        >
          <AutoComplete
            value={searchValue}
            options={searchOptions}
            onSearch={handleSearchPlace}
            onSelect={handleSelectPlace}
            placeholder="Ej: Hospital Universitario del Valle, Cali"
            style={{ width: '100%' }}
            notFoundContent={isLoadingPlaces ? "Buscando..." : "No se encontraron resultados"}
            size="large"
          />
          <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
            💡 Escribe al menos 3 caracteres para buscar
          </div>
        </Form.Item>

        <div style={{ 
          margin: '20px 0', 
          borderTop: '1px dashed #d9d9d9', 
          paddingTop: '20px',
          position: 'relative',
          textAlign: 'center'
        }}>
          <span style={{ 
            position: 'absolute', 
            top: '-10px', 
            left: '50%', 
            transform: 'translateX(-50%)',
            background: 'white',
            padding: '0 10px',
            fontSize: '12px',
            color: '#999'
          }}>
            O ingresa manualmente
          </span>
        </div>

        <Form.Item
          name="nombre"
          label="Nombre del marcador"
          rules={[{ required: true, message: "Por favor ingresa un nombre" }]}
        >
          <Input placeholder="Nombre del lugar" />
        </Form.Item>

        <Form.Item
          name="tipo"
          label="Tipo"
          rules={[{ required: true, message: "Por favor selecciona un tipo" }]}
        >
          <Select placeholder="Selecciona una categoría">
            <Select.Option value="hospitales">Hospitales</Select.Option>
            <Select.Option value="colegios">Colegios</Select.Option>
            <Select.Option value="clinicas">Clínicas</Select.Option>
            <Select.Option value="bancos">Bancos</Select.Option>
            <Select.Option value="universidades">Universidades</Select.Option>
            <Select.Option value="centros comerciales">
              Centros comerciales
            </Select.Option>
            <Select.Option value="robos">Robos</Select.Option>
            <Select.Option value="foto multas">Foto multas</Select.Option>
            <Select.Option value="hueco">Huecos</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Coordenadas"
          required
          tooltip="Coordenadas obtenidas de la búsqueda o ingresadas manualmente"
        >
          <div
            style={{
              border: lat && lng ? "2px solid #52c41a" : "1px solid #ddd",
              padding: "15px",
              borderRadius: "8px",
              background: lat && lng ? "#f6ffed" : "white",
              transition: "all 0.3s ease",
            }}
          >
            {lat && lng && (
              <div style={{ 
                fontSize: '12px', 
                color: '#52c41a', 
                marginBottom: '12px',
                fontWeight: 600,
                textAlign: 'center'
              }}>
                ✓ Coordenadas configuradas correctamente
              </div>
            )}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500 }}>
                  Latitud
                </label>
                <Input
                  placeholder="3.449378"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value))}
                  type="number"
                  step="0.000001"
                  size="large"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500 }}>
                  Longitud
                </label>
                <Input
                  placeholder="-76.5452443"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value))}
                  type="number"
                  step="0.000001"
                  size="large"
                />
              </div>
            </div>
            <div style={{ fontSize: '11px', color: '#999', marginTop: '8px', textAlign: 'center' }}>
              Rango válido - Lat: 3.35 a 3.55, Lng: -76.65 a -76.45
            </div>
          </div>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button onClick={handleCancel} size="large" style={{ flex: 1 }}>
              Cancelar
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              disabled={!lat || !lng}
              size="large"
              style={{ flex: 2 }}
            >
              {lat && lng ? '✓ Crear Marcador' : 'Ingresa las coordenadas'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateMarkerModal;
