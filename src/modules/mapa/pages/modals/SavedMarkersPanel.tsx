/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Drawer, Button, List, Tag, Popconfirm, message, Empty } from 'antd';
import { DeleteOutlined, EnvironmentOutlined, PictureOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { MarkerData } from '../../../../services/types';
import { ImageMarkerData } from './CreateImageMarkerModal';

interface SavedMarkersPanelProps {
  visible: boolean;
  onClose: () => void;
  onDeleteMarker?: (index: number) => void;
  onDeleteImageMarker?: (index: number) => void;
}

const SavedMarkersPanel = ({ visible, onClose }: SavedMarkersPanelProps) => {
  const [customMarkers, setCustomMarkers] = useState<MarkerData[]>([]);
  const [imageMarkers, setImageMarkers] = useState<ImageMarkerData[]>([]);

  const loadMarkers = () => {
    try {
      const savedMarkers = localStorage.getItem('customMarkers');
      const savedImageMarkers = localStorage.getItem('imageMarkers');
      
      if (savedMarkers) {
        setCustomMarkers(JSON.parse(savedMarkers));
      }
      if (savedImageMarkers) {
        setImageMarkers(JSON.parse(savedImageMarkers));
      }
    } catch (error) {
      console.error('Error al cargar marcadores:', error);
    }
  };

  const handleDeleteMarker = (index: number) => {
    try {
      const updatedMarkers = customMarkers.filter((_, i) => i !== index);
      localStorage.setItem('customMarkers', JSON.stringify(updatedMarkers));
      setCustomMarkers(updatedMarkers);
      message.success('Marcador eliminado');
      window.location.reload(); // Recargar para actualizar el mapa
    } catch (error) {
      message.error('Error al eliminar marcador');
    }
  };

  const handleDeleteImageMarker = (index: number) => {
    try {
      const updatedMarkers = imageMarkers.filter((_, i) => i !== index);
      localStorage.setItem('imageMarkers', JSON.stringify(updatedMarkers));
      setImageMarkers(updatedMarkers);
      message.success('Marcador de imagen eliminado');
      window.location.reload(); // Recargar para actualizar el mapa
    } catch (error) {
      message.error('Error al eliminar marcador');
    }
  };

  const handleClearAll = () => {
    try {
      localStorage.removeItem('customMarkers');
      localStorage.removeItem('imageMarkers');
      setCustomMarkers([]);
      setImageMarkers([]);
      message.success('Todos los marcadores eliminados');
      window.location.reload();
    } catch (error) {
      message.error('Error al limpiar marcadores');
    }
  };

  // Cargar marcadores cuando se abre el drawer
  if (visible && (customMarkers.length === 0 && imageMarkers.length === 0)) {
    loadMarkers();
  }

  return (
    <Drawer
      title={
        <span>
          <UnorderedListOutlined style={{ marginRight: 8 }} />
          Marcadores Guardados
        </span>
      }
      placement="left"
      onClose={onClose}
      open={visible}
      width={400}
      extra={
        customMarkers.length + imageMarkers.length > 0 && (
          <Popconfirm
            title="¿Eliminar todos los marcadores?"
            description="Esta acción no se puede deshacer"
            onConfirm={handleClearAll}
            okText="Sí, eliminar"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
          >
            <Button danger size="small">
              Limpiar Todo
            </Button>
          </Popconfirm>
        )
      }
    >
      {customMarkers.length === 0 && imageMarkers.length === 0 ? (
        <Empty
          description="No hay marcadores guardados"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <>
          {customMarkers.length > 0 && (
            <>
              <div style={{ marginBottom: 16, fontWeight: 600, color: '#667eea' }}>
                <EnvironmentOutlined /> Marcadores ({customMarkers.length})
              </div>
              <List
                dataSource={customMarkers}
                renderItem={(marker, index) => (
                  <List.Item
                    key={index}
                    style={{
                      padding: '12px',
                      background: '#f9f9f9',
                      borderRadius: '8px',
                      marginBottom: '8px',
                    }}
                    actions={[
                      <Popconfirm
                        title="¿Eliminar este marcador?"
                        onConfirm={() => handleDeleteMarker(index)}
                        okText="Eliminar"
                        cancelText="Cancelar"
                      >
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          size="small"
                        />
                      </Popconfirm>,
                    ]}
                  >
                    <List.Item.Meta
                      title={marker.nombre}
                      description={
                        <div>
                          <Tag color="blue">{marker.tipo}</Tag>
                          <div style={{ fontSize: '11px', color: '#999', marginTop: 4 }}>
                            📍 {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </>
          )}

          {imageMarkers.length > 0 && (
            <>
              <div style={{ marginTop: 24, marginBottom: 16, fontWeight: 600, color: '#56ab2f' }}>
                <PictureOutlined /> Imágenes ({imageMarkers.length})
              </div>
              <List
                dataSource={imageMarkers}
                renderItem={(marker, index) => (
                  <List.Item
                    key={index}
                    style={{
                      padding: '12px',
                      background: '#f9f9f9',
                      borderRadius: '8px',
                      marginBottom: '8px',
                    }}
                    actions={[
                      <Popconfirm
                        title="¿Eliminar esta imagen?"
                        onConfirm={() => handleDeleteImageMarker(index)}
                        okText="Eliminar"
                        cancelText="Cancelar"
                      >
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          size="small"
                        />
                      </Popconfirm>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <img
                          src={marker.imageUrl}
                          alt={marker.nombre}
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: 'cover',
                            borderRadius: 6,
                          }}
                        />
                      }
                      title={marker.nombre || 'Sin nombre'}
                      description={
                        <div style={{ fontSize: '11px', color: '#999' }}>
                          📍 {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </>
          )}
        </>
      )}
    </Drawer>
  );
};

export default SavedMarkersPanel;
